import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const REQUEST_TIMEOUT_MS = 30000;
const HEALTH_PROMPT = "Reply with exactly: FACTS BIFROST CONNECTION SUCCESSFUL.";
const EXPECTED_REPLY = "FACTS BIFROST CONNECTION SUCCESSFUL.";

class GatewayError extends Error {
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

async function callGateway(baseUrl: string, apiKey: string | undefined, model: string) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

  const started = Date.now();
  let response: Response;
  try {
    response = await fetch(`${baseUrl.replace(/\/+$/, "")}/v1/chat/completions`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: HEALTH_PROMPT }],
        temperature: 0,
        max_tokens: 40,
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      throw new GatewayError("The Bifrost gateway did not answer in time.", 504);
    }
    throw new GatewayError("The Bifrost gateway could not be reached from the server.", 502);
  }

  if (response.status === 401 || response.status === 403) {
    throw new GatewayError("Bifrost rejected the access key. Check BIFROST_API_KEY.", 401);
  }
  if (response.status === 429) {
    throw new GatewayError("Bifrost rate limit reached. Try again shortly.", 429);
  }
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    console.error("bifrost health non-OK", response.status, detail.slice(0, 500));
    throw new GatewayError(`Bifrost returned an error (HTTP ${response.status}).`, 502);
  }

  let data: any;
  try {
    data = await response.json();
  } catch {
    throw new GatewayError("Bifrost returned an unreadable response.", 502);
  }

  const reply = data?.choices?.[0]?.message?.content;
  if (typeof reply !== "string" || !reply.trim()) {
    throw new GatewayError("Bifrost responded without a model message.", 502);
  }

  return {
    reply: reply.trim(),
    matchesExpected: reply.trim() === EXPECTED_REPLY,
    model: typeof data?.model === "string" ? data.model : model,
    responseTime: Date.now() - started,
  };
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
      return json({ error: "Please sign in again to run this check." }, 401);
    }

    const baseUrl = Deno.env.get("BIFROST_BASE_URL");
    const model = Deno.env.get("BIFROST_MODEL");
    if (!baseUrl || !model) {
      return json({ error: "The Bifrost gateway is not set up for this project yet." }, 503);
    }

    const result = await callGateway(baseUrl, Deno.env.get("BIFROST_API_KEY") || undefined, model);
    return json(result, 200);
  } catch (error) {
    if (error instanceof GatewayError) {
      return json({ error: error.message }, error.status);
    }
    console.error("bifrost-health failed", error);
    return json({ error: "The gateway check could not be completed. Please try again." }, 500);
  }
});
