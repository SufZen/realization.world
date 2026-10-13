"use client";

import { useSyncExternalStore } from "react";

/** "20261020T170000Z" → epoch ms. */
const parseUtc = (value: string) =>
  Date.UTC(+value.slice(0, 4), +value.slice(4, 6) - 1, +value.slice(6, 8), +value.slice(9, 11), +value.slice(11, 13));

// Hebrew counts: 1 and 2 have their own words (יום אחד, יומיים).
const count = (n: number, one: string, two: string, many: string) => (n === 1 ? one : n === 2 ? two : `${n} ${many}`);

export function countdownLabel(now: number, start: number, end: number) {
  if (now >= end) return "";
  if (now >= start) return "משדרים עכשיו";
  const minutes = Math.ceil((start - now) / 60000);
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const mins = minutes % 60;
  // Two units at most: days and hours, or hours and minutes on the last day.
  const parts = (days
    ? [count(days, "יום אחד", "יומיים", "ימים"), hours && count(hours, "שעה אחת", "שעתיים", "שעות")]
    : [hours && count(hours, "שעה אחת", "שעתיים", "שעות"), mins && count(mins, "דקה אחת", "שתי דקות", "דקות")]
  ).filter(Boolean);
  return `עוד ${parts.join(" ו־")}`;
}

// One shared minute clock for every countdown on the page.
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | undefined;
let now = 0;
function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!timer) {
    now = Date.now();
    timer = setInterval(() => {
      now = Date.now();
      listeners.forEach((fn) => fn());
    }, 20000);
  }
  return () => {
    listeners.delete(listener);
    if (!listeners.size) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

/**
 * Time left until the webinar, updated each minute. Renders nothing on the server
 * (the time differs), and the box keeps its height so nothing shifts when it fills in.
 */
export function Countdown({ startUtc, endUtc, className }: { startUtc: string; endUtc: string; className?: string }) {
  const time = useSyncExternalStore(subscribe, () => (now ||= Date.now()), () => 0);
  const label = time ? countdownLabel(time, parseUtc(startUtc), parseUtc(endUtc)) : "";
  if (time && !label) return null;
  return (
    <p className={`wm-countdown ${className ?? ""}`} role="timer" aria-live="off">
      {label}
    </p>
  );
}
