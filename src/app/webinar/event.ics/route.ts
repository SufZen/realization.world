import { siteUrl } from "@/content/site";
import { webinar } from "@/lib/webinar";

export const dynamic = "force-static";

// RFC 5545 text values: escape \ ; , and line breaks.
const text = (value: string) => value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

// Lines longer than 75 bytes are folded (CRLF + space), never inside a character.
function fold(line: string) {
  const out: string[] = [];
  let current = "";
  let bytes = 0;
  for (const char of line) {
    const size = new TextEncoder().encode(char).length;
    if (bytes + size > (out.length ? 74 : 75)) {
      out.push(current);
      current = "";
      bytes = 0;
    }
    current += char;
    bytes += size;
  }
  out.push(current);
  return out.join("\r\n ");
}

/**
 * The webinar as a calendar file, for Apple Calendar and Outlook ("add to calendar" on the
 * thank-you page). The emailed invite stays the main path; this is the backup.
 */
export function GET() {
  const body = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Realization//Webinar//HE",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:webinar-${webinar.startUtc}@realization.world`,
    "DTSTAMP:20261013T000000Z",
    `DTSTART:${webinar.startUtc}`,
    `DTEND:${webinar.endUtc}`,
    `SUMMARY:${text(`וובינר: ${webinar.shortTitle}`)}`,
    `DESCRIPTION:${text(`${webinar.title}.\n\nהקישור לשידור יישלח במייל לפני תחילת הוובינר. הוובינר מוקלט.\n\n${siteUrl}/webinar`)}`,
    `LOCATION:${text("שידור חי, הקישור יישלח במייל")}`,
    `URL:${siteUrl}/webinar`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].map(fold).join("\r\n") + "\r\n";
  return new Response(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="realization-webinar-20-10.ics"',
    },
  });
}
