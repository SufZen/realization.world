import type { Metadata } from "next";
import { Lines } from "@/components/lines";
import { VideoGrid } from "@/components/media-blocks";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { CtaLink } from "@/components/services/cta-link";
import { InsightFeed } from "@/components/services/sections";
import { SocialLinks } from "@/components/social-links";
import { insights } from "@/content/site";
import { isWebinarOpen, type Cta } from "@/content/services";
import { newsletterUrl, youtubeChannelUrl } from "@/content/social";
import { pageMetadata } from "@/lib/metadata";
import { latestVideos } from "@/lib/youtube";

export const metadata: Metadata = pageMetadata(
  "Learn — field notes, videos and webinars",
  "Field notes, short videos and webinars from Realization's real projects: property, development and AI in practice. Free, in English and Hebrew.",
  "/insights",
);

// Videos come from the YouTube feed and the webinar offer ends on 20.10: regenerate hourly.
export const revalidate = 3600;

const ref = "learn";
const updates: Cta = { label: "Get Realization updates", href: newsletterUrl, event: "join-newsletter", data: { place: "learn" } };
const youtube: Cta = { label: "Subscribe on YouTube", href: `${youtubeChannelUrl}?sub_confirmation=1`, event: "social", data: { network: "youtube", place: "learn" } };
const webinar: Cta = { label: "Save a seat · free", href: "/webinar", event: "join-webinar", data: { pillar: "learn" }, carryRef: true };

export default async function LearnPage() {
  const videos = await latestVideos(6);
  const notes = [...insights].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <PageHero
        index="L"
        eyebrow="LEARN"
        title="Learn from | the field."
        intro="Field notes, videos and webinars | from real projects: property, development | and AI in practice."
        theme="light"
        actions={<><CtaLink cta={updates} pageRef={ref} variant="dark" /><CtaLink cta={youtube} pageRef={ref} variant="outline" /></>}
      />

      {isWebinarOpen() && (
        <section className="section surface-brand">
          <div className="container-wide diagram-row">
            <SectionHeading eyebrow="FREE WEBINAR · IN HEBREW" title="Five real AI cases | from real-estate projects." intro="Tuesday 20 October, 20:00 Israel time. | Ninety minutes, and one audience problem | worked on screen." />
            <div className="button-row"><CtaLink cta={webinar} pageRef={ref} variant="dark" /></div>
          </div>
        </section>
      )}

      {videos.length > 0 && (
        <section className="section">
          <div className="container-wide">
            <SectionHeading eyebrow="WATCH" title="Short videos | from the work." intro="New videos most weeks, in Hebrew and English. | They open on YouTube." />
            <VideoGrid videos={videos} place="learn" />
            <div className="button-row"><CtaLink cta={{ ...youtube, label: "All videos on YouTube" }} pageRef={ref} variant="dark" /></div>
          </div>
        </section>
      )}

      <InsightFeed insights={notes} title="Built from reality." intro="Written by Asaf Eyzenkot (Suf Zen), | from the work itself." />

      <section className="cta-band">
        <div className="container-wide cta-band__grid">
          <div>
            <p className="eyebrow">STAY IN TOUCH</p>
            <h2><Lines text="Get the field notes | by email." /></h2>
            <p><Lines text="Occasional updates: new tools, case studies and events. | Unsubscribe any time." /></p>
            <SocialLinks />
          </div>
          <div className="button-row"><CtaLink cta={updates} pageRef={ref} variant="dark" /></div>
        </div>
      </section>
    </>
  );
}
