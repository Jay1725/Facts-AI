import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const TAVILY_SEARCH_URL = "https://api.tavily.com/search";
const REQUEST_TIMEOUT_MS = 15000;
const MAX_QUERY_LENGTH = 200;
const MAX_RESULTS = 5;

interface TestResult {
  title: string;
  url: string;
  content: string;
  score: number | null;
  publishedDate: string | null;
}

class SearchError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function toIsoDate(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const time = Date.parse(value);
  return Number.isNaN(time) ? null : new Date(time).toISOString();
}

async function searchTavily(apiKey: string, query: string): Promise<any> {
  let response: Response;
  try {
    response = await fetch(TAVILY_SEARCH_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        search_depth: "basic",
        topic: "general",
        max_results: MAX_RESULTS,
        include_published_date: true,
        include_answer: false,
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      throw new SearchError("The Tavily request timed out. Try again.", 504);
    }
    throw new SearchError("Tavily could not be reached from the server.", 502);
  }

  if (response.status === 401 || response.status === 403) {
    throw new SearchError("Tavily rejected the API key. Check that the key is correct.", 401);
  }
  if (response.status === 429) {
    throw new SearchError("Tavily rate limit reached. Try again in a few minutes.", 429);
  }
  if (response.status >= 430 && response.status <= 434) {
    throw new SearchError("The Tavily plan's usage limit has been reached.", 429);
  }
  if (!response.ok) {
    throw new SearchError(`Tavily returned an error (HTTP ${response.status}).`, 502);
  }

  try {
    return await response.json();
  } catch {
    throw new SearchError("Tavily returned an unreadable response.", 502);
  }
}

function toResults(data: any): TestResult[] {
  const items: any[] = Array.isArray(data?.results) ? data.results : [];
  return items
    .filter((item) => typeof item?.url === "string" && item.url.startsWith("http"))
    .slice(0, MAX_RESULTS)
    .map((item) => ({
      title: typeof item.title === "string" && item.title.trim() ? item.title.trim() : item.url,
      url: item.url,
      content: typeof item.content === "string" ? item.content.trim() : "",
      score: typeof item.score === "number" ? item.score : null,
      publishedDate: toIsoDate(item.published_date),
    }));
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
      return json({ error: "Please sign in again to run this test." }, 401);
    }

    const body = await req.json().catch(() => null);
    const query = typeof body?.query === "string" ? body.query.trim() : "";
    if (!query || query.length > MAX_QUERY_LENGTH) {
      return json({ error: `Enter a search query of up to ${MAX_QUERY_LENGTH} characters.` }, 400);
    }

    const apiKey = Deno.env.get("TAVILY_API_KEY");
    if (!apiKey) {
      return json({ error: "The Tavily API key is not set up for this project yet." }, 503);
    }

    const data = await searchTavily(apiKey, query);
    const results = toResults(data);
    return json(
      {
        query,
        responseTime: typeof data?.response_time === "string" ? Number(data.response_time) || null : null,
        results,
      },
      200,
    );
  } catch (error) {
    if (error instanceof SearchError) {
      return json({ error: error.message }, error.status);
    }
    console.error("tavily-test-search failed", error);
    return json({ error: "The search could not be completed. Please try again." }, 500);
  }
});
