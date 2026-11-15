import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const TAVILY_SEARCH_URL = "https://api.tavily.com/search";
const TAVILY_EXTRACT_URL = "https://api.tavily.com/extract";
const REQUEST_TIMEOUT_MS = 15000;
const MAX_CLAIMS = 5;
const MAX_SOURCES = 5;
const MAX_CLAIM_LENGTH = 500;
const MAX_SNIPPET_LENGTH = 600;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Verdict = "CURRENT" | "OUTDATED" | "INACCURATE" | "UNSUPPORTED" | "NEEDS_REVIEW";

interface EvidenceSource {
  title: string;
  url: string;
  publishedAt: string | null;
}

interface ClaimResult {
  id: string;
  text: string;
  verdict: Verdict;
  explanation: string;
  confidence: { level: "high" | "medium" | "low"; reason: string };
  supportingEvidence: string[];
  contradictingEvidence: string[];
  sources: EvidenceSource[];
  suggestedCorrection: null;
}

interface ReportRow {
  id: string;
  submission_type: "text" | "url";
  submitted_text: string | null;
  submitted_url: string | null;
  status: string;
}

class ResearchError extends Error {
  constructor(message: string, readonly fatal: boolean) {
    super(message);
  }
}

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function tavilyPost(url: string, apiKey: string, body: Record<string, unknown>): Promise<any> {
  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      throw new ResearchError("The web search took too long to respond.", false);
    }
    throw new ResearchError("The web search service could not be reached.", false);
  }

  if (response.status === 401 || response.status === 403) {
    throw new ResearchError("The Tavily API key was rejected. Check that the key is correct.", true);
  }
  if (response.status === 429) {
    throw new ResearchError("Web search rate limit reached. Try again in a few minutes.", true);
  }
  if (response.status >= 430 && response.status <= 434) {
    throw new ResearchError("The Tavily plan's usage limit has been reached.", true);
  }
  if (!response.ok) {
    throw new ResearchError("The web search service returned an error.", false);
  }

  try {
    return await response.json();
  } catch {
    throw new ResearchError("The web search service returned an unreadable response.", false);
  }
}

function toIsoDate(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const time = Date.parse(value);
  return Number.isNaN(time) ? null : new Date(time).toISOString();
}

function clip(value: string, max: number): string {
  return value.length > max ? `${value.slice(0, max - 1).trimEnd()}...` : value;
}

function splitIntoClaims(text: string): string[] {
  const sentences = text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length >= 20)
    .map((sentence) => clip(sentence, MAX_CLAIM_LENGTH))
    .slice(0, MAX_CLAIMS);
  if (sentences.length > 0) return sentences;
  const whole = text.trim();
  return whole ? [clip(whole, MAX_CLAIM_LENGTH)] : [];
}

async function loadPageText(url: string, apiKey: string): Promise<string> {
  const data = await tavilyPost(TAVILY_EXTRACT_URL, apiKey, { urls: [url] });
  const first = Array.isArray(data?.results) ? data.results[0] : undefined;
  const content = typeof first?.raw_content === "string" ? first.raw_content.trim() : "";
  if (!content) {
    throw new ResearchError("The web page could not be read, so its claims could not be checked.", true);
  }
  return content;
}

async function researchClaim(apiKey: string, id: string, text: string): Promise<ClaimResult> {
  const data = await tavilyPost(TAVILY_SEARCH_URL, apiKey, {
    query: text,
    search_depth: "basic",
    topic: "general",
    max_results: MAX_SOURCES,
    include_published_date: true,
    include_answer: false,
  });

  const results: any[] = Array.isArray(data?.results) ? data.results : [];
  const usable = results.filter(
    (item) => typeof item?.url === "string" && item.url.startsWith("http"),
  );
  const sources: EvidenceSource[] = usable.slice(0, MAX_SOURCES).map((item) => ({
    title: typeof item.title === "string" && item.title.trim() ? item.title.trim() : item.url,
    url: item.url,
    publishedAt: toIsoDate(item.published_date),
  }));
  const snippets = usable
    .slice(0, 3)
    .map((item) => (typeof item.content === "string" ? clip(item.content.trim(), MAX_SNIPPET_LENGTH) : ""))
    .filter((snippet) => snippet.length > 0);

  if (sources.length === 0) {
    return {
      id,
      text,
      verdict: "UNSUPPORTED",
      explanation: "No live web sources matched this claim, so the available research cannot establish it.",
      confidence: { level: "low", reason: "The live search returned no matching sources." },
      supportingEvidence: [],
      contradictingEvidence: [],
      sources: [],
      suggestedCorrection: null,
    };
  }

  return {
    id,
    text,
    verdict: "NEEDS_REVIEW",
    explanation: `Live search found ${sources.length} source${sources.length === 1 ? "" : "s"} related to this claim. Automatic comparison of these sources against the claim is not available yet, so read them before relying on it.`,
    confidence: { level: "low", reason: "Sources were found but have not been compared against the claim." },
    supportingEvidence: snippets,
    contradictingEvidence: [],
    sources,
    suggestedCorrection: null,
  };
}

function unresolvedClaim(id: string, text: string, message: string): ClaimResult {
  return {
    id,
    text,
    verdict: "NEEDS_REVIEW",
    explanation: `This claim could not be searched. ${message}`,
    confidence: { level: "low", reason: "The live search did not complete." },
    supportingEvidence: [],
    contradictingEvidence: [],
    sources: [],
    suggestedCorrection: null,
  };
}

async function markFailed(admin: SupabaseClient, reportId: string, message: string) {
  await admin
    .from("verification_reports")
    .update({ status: "failed", error_message: message, claims: [], summary: null, updated_at: new Date().toISOString() })
    .eq("id", reportId);
}

async function runVerification(admin: SupabaseClient, report: ReportRow, apiKey: string) {
  const sourceText =
    report.submission_type === "url" ? await loadPageText(report.submitted_url ?? "", apiKey) : report.submitted_text ?? "";
  const claimTexts = splitIntoClaims(sourceText);
  if (claimTexts.length === 0) {
    throw new ResearchError("No checkable statements were found in this submission.", true);
  }

  const claims: ClaimResult[] = [];
  let failedSearches = 0;
  let firstFailure = "";
  for (const [index, text] of claimTexts.entries()) {
    const id = `${report.id}-${index + 1}`;
    try {
      claims.push(await researchClaim(apiKey, id, text));
    } catch (error) {
      if (error instanceof ResearchError && error.fatal) throw error;
      const message = error instanceof ResearchError ? error.message : "An unexpected error occurred.";
      failedSearches += 1;
      firstFailure ||= message;
      claims.push(unresolvedClaim(id, text, message));
    }
  }

  if (failedSearches === claims.length) {
    throw new ResearchError(firstFailure, false);
  }

  const sourceCount = claims.reduce((total, claim) => total + claim.sources.length, 0);
  const summary = `Searched the live web for ${claims.length} claim${claims.length === 1 ? "" : "s"} and found ${sourceCount} source${sourceCount === 1 ? "" : "s"} in total. Sources and evidence are listed for each claim. Claims marked as needing review have not been judged automatically.`;

  const { error } = await admin
    .from("verification_reports")
    .update({ status: "completed", summary, claims, error_message: null, updated_at: new Date().toISOString() })
    .eq("id", report.id);
  if (error) throw new Error("Results could not be saved.");

  return claims.length;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed." }, 405);
  }

  try {
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
      auth: { persistSession: false },
    });

    const token = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
    const { data: userData, error: userError } = await admin.auth.getUser(token);
    if (userError || !userData.user) {
      return json({ error: "Please sign in again to check this submission." }, 401);
    }

    const body = await req.json().catch(() => null);
    const reportId = typeof body?.reportId === "string" ? body.reportId : "";
    if (!UUID_PATTERN.test(reportId)) {
      return json({ error: "A valid submission is required." }, 400);
    }

    const { data: report, error: loadError } = await admin
      .from("verification_reports")
      .select("id, submission_type, submitted_text, submitted_url, status")
      .eq("id", reportId)
      .eq("user_id", userData.user.id)
      .maybeSingle();
    if (loadError) return json({ error: "This submission could not be loaded." }, 500);
    if (!report) return json({ error: "This submission was not found." }, 404);
    if (report.status !== "submitted" && report.status !== "failed") {
      return json({ error: "This submission has already been checked." }, 409);
    }

    const apiKey = Deno.env.get("TAVILY_API_KEY");
    if (!apiKey) {
      await markFailed(admin, reportId, "Live web research is not set up for this project yet.");
      return json({ error: "Live web research is not set up for this project yet." }, 503);
    }

    await admin
      .from("verification_reports")
      .update({ status: "processing", error_message: null, updated_at: new Date().toISOString() })
      .eq("id", reportId);

    try {
      const claimCount = await runVerification(admin, report as ReportRow, apiKey);
      return json({ status: "completed", claimCount }, 200);
    } catch (error) {
      const message =
        error instanceof ResearchError ? error.message : "Verification could not be completed. Please try again.";
      await markFailed(admin, reportId, message);
      return json({ error: message }, 502);
    }
  } catch (error) {
    console.error("verify-report failed", error);
    return json({ error: "Verification could not be started. Please try again." }, 500);
  }
});
