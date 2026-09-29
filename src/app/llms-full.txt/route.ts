import { llmsFull, markdownHeaders } from "@/lib/markdown";

export const dynamic = "force-static";

export function GET() {
  return new Response(llmsFull(), { headers: { ...markdownHeaders, "Content-Type": "text/plain; charset=utf-8" } });
}
