import { llmsIndex, markdownHeaders } from "@/lib/markdown";

export const dynamic = "force-static";

export function GET() {
  return new Response(llmsIndex(), { headers: { ...markdownHeaders, "Content-Type": "text/plain; charset=utf-8" } });
}
