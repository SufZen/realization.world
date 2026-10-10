import { ArrowUpRight, Mail, Play, UsersRound } from "lucide-react";
import Image from "next/image";
import { SocialIcon } from "@/components/social-links";
import { communities, mainChannels, type SocialNetwork } from "@/content/social";
import type { FeedItem } from "@/lib/feed";
import styles from "./channel-feed.module.css";

const networkNames: Record<string, string> = { youtube: "YouTube", facebook: "Facebook", linkedin: "LinkedIn", twitter: "X", instagram: "Instagram", tiktok: "TikTok" };
const iconFor = (network: string): SocialNetwork | null => (network === "twitter" ? "x" : network in networkNames ? (network as SocialNetwork) : null);
const dateLabel = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

/** Latest posts and videos from all channels, each opening on its own network (no embeds, no third-party scripts). */
export function LatestFeed({ items, place }: { items: FeedItem[]; place: string }) {
  if (!items.length) return null;
  return (
    <ul className={styles.feed}>
      {items.map((item) => {
        const icon = iconFor(item.network);
        const name = networkNames[item.network] ?? item.network;
        return (
          <li key={item.id}>
            <a className={styles.item} href={item.url} target="_blank" rel="noopener" data-umami-event="feed-click" data-umami-event-network={item.network} data-umami-event-place={place}>
              {item.thumbnail ? (
                <span className={styles.thumb}>
                  {/* Thumbnails come from YouTube and Buffer's image hosts; shown as-is. */}
                  <Image src={item.thumbnail} alt="" fill unoptimized sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw" />
                  {item.video && <span className={styles.play} aria-hidden="true"><span><Play size={20} fill="currentColor" /></span></span>}
                </span>
              ) : (
                <span className={`${styles.thumb} ${styles.blank}`} aria-hidden="true">{icon && <SocialIcon network={icon} size={38} />}</span>
              )}
              <span className={styles.meta}>{icon && <SocialIcon network={icon} size={14} />}{name} · {dateLabel(item.published)}</span>
              <span className={styles.text} dir="auto">{item.text}</span>
              <span className={styles.open}>Open on {name} <ArrowUpRight aria-hidden="true" size={14} style={{ display: "inline", verticalAlign: "-2px" }} /></span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

/** "Follow the work": a card per main channel, saying what people get there. */
export function FollowTheWork({ place }: { place: string }) {
  return (
    <ul className={styles.channels}>
      {mainChannels.map((channel) => {
        const icon = channel.id === "groups" ? <UsersRound size={20} /> : channel.id === "email" ? <Mail size={20} /> : <SocialIcon network={channel.id} size={19} />;
        const event = channel.id === "email" ? { "data-umami-event": "join-newsletter" } : channel.id === "groups" ? { "data-umami-event": "join-group" } : { "data-umami-event": "social", "data-umami-event-network": channel.id };
        return (
          <li className={styles.channel} key={channel.id}>
            <div className={styles.channelHead}>
              <span className={styles.icon} aria-hidden="true">{icon}</span>
              <div><h3>{channel.name}</h3>{channel.stat && <span className={styles.stat}>{channel.stat}</span>}</div>
            </div>
            <p>{channel.what}</p>
            <div className={styles.actions}>
              {channel.id === "groups" ? (
                communities.map((group, index) => (
                  <a className={`${styles.action} ${index === 1 ? styles.primary : ""}`} href={group.href} target="_blank" rel="noopener" data-umami-event="join-group" data-umami-event-group={group.lang} data-umami-event-place={place} key={group.href}>
                    Join · {group.lang === "he" ? "Hebrew" : "English"}
                  </a>
                ))
              ) : (
                <a className={`${styles.action} ${styles.primary}`} href={channel.href} target="_blank" rel="noopener" {...event} data-umami-event-place={place}>
                  {channel.action}<span className="sr-only"> on {channel.name}</span> <ArrowUpRight aria-hidden="true" size={15} />
                </a>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
