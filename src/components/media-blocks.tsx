import { Play } from "lucide-react";
import Image from "next/image";
import { SectionHeading } from "@/components/section-heading";
import type { PillarSlug } from "@/content/services";
import { testimonials } from "@/content/testimonials";
import { videoPillars } from "@/content/videos";
import { latestVideos, type Video } from "@/lib/youtube";
import styles from "./media-blocks.module.css";

const dateLabel = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

/** YouTube videos as cards that open on YouTube (no embedded player, so no YouTube cookies here). */
export function VideoGrid({ videos, place }: { videos: Video[]; place: string }) {
  if (!videos.length) return null;
  return (
    <ul className={styles.videos}>
      {videos.map((video) => (
        <li key={video.id}>
          <a className={styles.video} href={video.url} target="_blank" rel="noopener" data-umami-event="watch-video" data-umami-event-video={video.id} data-umami-event-place={place}>
            <span className={styles.thumb}>
              <Image src={video.thumbnail} alt="" fill sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw" />
              <span className={styles.play} aria-hidden="true"><span><Play size={22} fill="currentColor" /></span></span>
            </span>
            <span className={styles.videoMeta}>{video.short ? "Short" : "Video"} · {dateLabel(video.published)}</span>
            <span className={styles.videoTitle} dir="auto">{video.title}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

/** A pillar page's videos (tagged in src/content/videos.ts). Renders nothing until there are some. */
export async function PillarVideos({ pillar, title, intro, eyebrow = "WATCH", surface = "" }: { pillar: PillarSlug; title: string; intro?: string; eyebrow?: string; surface?: string }) {
  const videos = (await latestVideos(15)).filter((video) => videoPillars[video.id] === pillar).slice(0, 3);
  if (!videos.length) return null;
  return (
    <section className={`section ${surface}`}>
      <div className="container-wide">
        <SectionHeading eyebrow={eyebrow} title={title} intro={intro} />
        <VideoGrid videos={videos} place={pillar} />
      </div>
    </section>
  );
}

/**
 * Quotes from clients and partners (src/content/testimonials.ts). With a pillar, only
 * that pillar's quotes; without, all of them. Renders nothing until there are quotes.
 */
export function Testimonials({ pillar, eyebrow = "IN THEIR WORDS", title = "What clients | and partners say.", surface = "" }: { pillar?: PillarSlug; eyebrow?: string; title?: string; surface?: string }) {
  const quotes = pillar ? testimonials.filter((item) => item.pillar === pillar) : testimonials;
  if (!quotes.length) return null;
  return (
    <section className={`section ${surface}`}>
      <div className="container-wide">
        <SectionHeading eyebrow={eyebrow} title={title} />
        <div className={styles.quotes}>
          {quotes.map((item) => (
            <figure className={styles.quote} key={`${item.name}-${item.quote.slice(0, 24)}`}>
              <blockquote dir="auto" lang={item.lang}>{item.quote}</blockquote>
              <figcaption>
                <strong>{item.name}</strong>
                <span>{[item.role, item.company].filter(Boolean).join(", ")}</span>
                {item.sourceUrl ? <a href={item.sourceUrl} target="_blank" rel="noopener">{item.source}</a> : <span>{item.source}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
