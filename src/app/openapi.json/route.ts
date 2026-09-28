import { siteUrl } from "@/content/site";

export const dynamic = "force-static";

const text = { type: "string" } as const;

export function GET() {
  return Response.json(
    {
      openapi: "3.1.0",
      info: {
        title: "Realization public content API",
        version: "1.0.0",
        description: "Read-only JSON about Realization's work (projects, ventures, systems, advisory cases) and field notes. The same data is available to MCP clients at /api/mcp.",
        contact: { email: "hello@realization.world", url: siteUrl },
      },
      servers: [{ url: siteUrl }],
      paths: {
        "/api/public/work": {
          get: {
            operationId: "listWork",
            summary: "List all portfolio items with a one-paragraph summary",
            responses: { "200": { description: "Portfolio items", content: { "application/json": { schema: { type: "object", properties: { work: { type: "array", items: { $ref: "#/components/schemas/WorkSummary" } } } } } } } },
          },
        },
        "/api/public/work/{slug}": {
          get: {
            operationId: "getWork",
            summary: "Full case study for one portfolio item",
            parameters: [{ name: "slug", in: "path", required: true, schema: text }],
            responses: { "200": { description: "Case study", content: { "application/json": { schema: { type: "object" } } } }, "404": { description: "Unknown slug" } },
          },
        },
        "/api/public/insights": {
          get: {
            operationId: "listInsights",
            summary: "All field notes with full text",
            responses: { "200": { description: "Field notes", content: { "application/json": { schema: { type: "object" } } } } },
          },
        },
      },
      components: {
        schemas: {
          WorkSummary: {
            type: "object",
            properties: { slug: text, name: text, category: text, status: text, location: text, role: text, summary: text, url: text, markdown: text },
          },
        },
      },
    },
    { headers: { "Access-Control-Allow-Origin": "*" } },
  );
}
