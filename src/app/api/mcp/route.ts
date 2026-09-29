import { insights } from "@/content/site";
import { work, workCategories } from "@/content/work";
import { clientKey, rateLimited, readBrief, validateBrief } from "@/lib/brief";
import { mailConfigured, sendBrief } from "@/lib/mail";
import { contact, findInsight, findWork, insightDetail, insightSummary, services, workDetail, workSummary } from "@/lib/public-data";

/**
 * Public MCP server for AI agents (Streamable HTTP transport, stateless, JSON responses).
 * Read-only tools expose the portfolio and field notes; submit_brief sends a brief to a
 * person at Realization, with the same validation and rate limit as the web form.
 */

const SUPPORTED_VERSIONS = ["2025-11-25", "2025-06-18", "2025-03-26", "2024-11-05"];
const serverInfo = { name: "realization-world", title: "Realization", version: "1.0.0" };

type JsonRpcRequest = { jsonrpc: "2.0"; id?: string | number | null; method: string; params?: Record<string, unknown> };
type ToolResult = { content: Array<{ type: "text"; text: string }>; structuredContent?: Record<string, unknown>; isError?: boolean };

const slugArg = (description: string) => ({ type: "object", properties: { slug: { type: "string", description } }, required: ["slug"] });

const tools = [
  {
    name: "list_work",
    title: "List Realization's work",
    description: "List Realization's portfolio: real-estate projects, ventures, AI systems and advisory case studies, each with a one-paragraph summary. Optionally filter by category.",
    inputSchema: { type: "object", properties: { category: { type: "string", enum: workCategories.map((category) => category.label) } } },
    annotations: { readOnlyHint: true },
  },
  {
    name: "get_case",
    title: "Get a case study",
    description: "Full case study for one portfolio item: problem, approach, outcome, key facts with sources, team, stack and the recommended next step.",
    inputSchema: slugArg(`Portfolio slug, one of: ${work.map((item) => item.slug).join(", ")}`),
    annotations: { readOnlyHint: true },
  },
  {
    name: "list_insights",
    title: "List field notes",
    description: "List Asaf Eyzenkot's field notes on property, development and AI in practice.",
    inputSchema: { type: "object", properties: {} },
    annotations: { readOnlyHint: true },
  },
  {
    name: "get_insight",
    title: "Read a field note",
    description: "Full text of one field note.",
    inputSchema: slugArg(`Field note slug, one of: ${insights.map((insight) => insight.slug).join(", ")}`),
    annotations: { readOnlyHint: true },
  },
  {
    name: "get_services",
    title: "Services and engagement model",
    description: "What Realization offers: AI adoption advisory (staged, fixed-scope), real-estate partnerships in Portugal, stuck-property resolution and fractional operations.",
    inputSchema: { type: "object", properties: {} },
    annotations: { readOnlyHint: true },
  },
  {
    name: "get_contact_and_booking",
    title: "Contact and booking",
    description: "Email, 30-minute intro booking link, WhatsApp, brief form, languages, locations and reply time.",
    inputSchema: { type: "object", properties: {} },
    annotations: { readOnlyHint: true },
  },
  {
    name: "submit_brief",
    title: "Send a brief to Realization",
    description: "Send a short brief to a person at Realization, who replies by email within two working days. Only use this when the user has asked you to contact Realization and has confirmed the details and consent.",
    inputSchema: {
      type: "object",
      properties: {
        path: { type: "string", enum: contact.brief_paths.map((path) => path.value), description: "Which kind of brief this is." },
        name: { type: "string" },
        email: { type: "string", description: "Where Realization should reply." },
        organization: { type: "string" },
        geography: { type: "string" },
        brief: { type: "string", description: "The opportunity or need, in a few sentences." },
        context: { type: "string", description: "Rights, evidence, constraints, timing or budget." },
        consent: { type: "boolean", description: "The user agrees Realization may use these details to reply (see /privacy)." },
      },
      required: ["path", "name", "email", "brief", "consent"],
    },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true },
  },
];

const ok = (data: Record<string, unknown>): ToolResult => ({ content: [{ type: "text", text: JSON.stringify(data, null, 2) }], structuredContent: data });
const fail = (message: string): ToolResult => ({ content: [{ type: "text", text: message }], isError: true });

async function callTool(name: string, args: Record<string, unknown>, request: Request): Promise<ToolResult> {
  switch (name) {
    case "list_work": {
      const items = work.map(workSummary).filter((item) => !args.category || item.category === args.category);
      return ok({ work: items });
    }
    case "get_case": {
      const item = findWork(String(args.slug ?? ""));
      return item ? ok(workDetail(item)) : fail(`Unknown slug. Use list_work to see valid slugs.`);
    }
    case "list_insights":
      return ok({ insights: insights.map(insightSummary) });
    case "get_insight": {
      const insight = findInsight(String(args.slug ?? ""));
      return insight ? ok(insightDetail(insight)) : fail(`Unknown slug. Use list_insights to see valid slugs.`);
    }
    case "get_services":
      return ok(services);
    case "get_contact_and_booking":
      return ok(contact);
    case "submit_brief": {
      const brief = readBrief((key) => (key === "ref" ? "mcp" : args[key]));
      const errors = validateBrief(brief, args.consent === true);
      if (Object.keys(errors).length) return fail(`Brief not sent: ${Object.values(errors).join(" ")}`);
      if (!mailConfigured()) return fail(`Online sending is unavailable. Ask the user to email ${contact.email} or book ${contact.booking_url}.`);
      if (rateLimited(`mcp:${clientKey(request.headers)}`)) return fail("Too many briefs. Try again in a few minutes.");
      try {
        await sendBrief(brief);
      } catch (error) {
        console.error("MCP brief failed to send", error);
        return fail(`The brief could not be sent. Ask the user to email ${contact.email}.`);
      }
      return ok({ sent: true, message: "Brief sent. Realization replies by email within two working days.", booking_url: contact.booking_url });
    }
    default:
      throw Object.assign(new Error(`Unknown tool: ${name}`), { code: -32602 });
  }
}

async function handle(message: JsonRpcRequest, request: Request) {
  const params = message.params ?? {};
  switch (message.method) {
    case "initialize": {
      const requested = String(params.protocolVersion ?? "");
      return {
        protocolVersion: SUPPORTED_VERSIONS.includes(requested) ? requested : SUPPORTED_VERSIONS[0],
        capabilities: { tools: { listChanged: false } },
        serverInfo,
        instructions: "Realization develops real estate in Portugal and builds ventures and AI systems. Use list_work and get_case for evidence, get_services for what can be bought, and get_contact_and_booking to help the user get in touch. Only call submit_brief with the user's explicit confirmation.",
      };
    }
    case "ping":
      return {};
    case "tools/list":
      return { tools };
    case "tools/call":
      return callTool(String(params.name ?? ""), (params.arguments as Record<string, unknown>) ?? {}, request);
    default:
      throw Object.assign(new Error(`Method not found: ${message.method}`), { code: -32601 });
  }
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept, Mcp-Protocol-Version, Mcp-Session-Id",
};

async function respond(message: JsonRpcRequest, request: Request) {
  try {
    return { jsonrpc: "2.0", id: message.id ?? null, result: await handle(message, request) };
  } catch (error) {
    const code = (error as { code?: number }).code ?? -32603;
    return { jsonrpc: "2.0", id: message.id ?? null, error: { code, message: (error as Error).message } };
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } }, { status: 400, headers: corsHeaders });
  }
  const messages = (Array.isArray(body) ? body : [body]) as JsonRpcRequest[];
  // Notifications (no id) get no response body.
  const requests = messages.filter((message) => message && message.id !== undefined && message.id !== null);
  if (!requests.length) return new Response(null, { status: 202, headers: corsHeaders });
  const results = await Promise.all(requests.map((message) => respond(message, request)));
  return Response.json(Array.isArray(body) ? results : results[0], { headers: corsHeaders });
}

export function GET() {
  // No server-initiated stream: this server is stateless.
  return new Response("This MCP endpoint accepts JSON-RPC over POST (Streamable HTTP). See https://realization.world/llms.txt", {
    status: 405,
    headers: { ...corsHeaders, Allow: "POST, OPTIONS" },
  });
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}
