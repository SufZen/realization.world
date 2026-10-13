"use client";

import { useEffect } from "react";

/**
 * Wires the webinar page's clips and the phone register bar. The markup is server-rendered
 * (poster images first, videos with preload="none"); this only decides when a clip plays.
 * With reduced motion nothing plays by itself; the brain clip's replay button still works.
 *
 *   [data-wm-hero]   the hero loop: starts once the page is idle, pauses off screen
 *   .wh-case         thumb clip on hover (fine pointers), body clip once on open
 *   [data-wm-brain]  plays once when half in view, holds its last frame; [data-wm-replay] replays
 *   .wh-sticky       shown once the hero's button has scrolled away, hidden while the form section is in view
 */
export function WebinarMotion() {
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
    const cleanups: (() => void)[] = [];

    const play = (video: HTMLVideoElement, force = false) => {
      if (reduce.matches && !force) return Promise.resolve(false);
      video.muted = true;
      video.preload = "auto";
      return video.play().then(() => true, () => false);
    };
    const observe = (target: Element, onChange: (entry: IntersectionObserverEntry) => void, threshold = 0.35) => {
      const observer = new IntersectionObserver((entries) => entries.forEach(onChange), { threshold });
      observer.observe(target);
      cleanups.push(() => observer.disconnect());
    };
    const listen = (target: EventTarget, type: string, handler: EventListener) => {
      target.addEventListener(type, handler);
      cleanups.push(() => target.removeEventListener(type, handler));
    };

    // Hero loop: never competes with the first paint.
    const hero = document.querySelector<HTMLVideoElement>("[data-wm-hero]");
    if (hero) {
      listen(hero, "playing", () => hero.classList.add("is-on"));
      const start = () => observe(hero, (entry) => (entry.isIntersecting ? play(hero) : hero.pause()), 0.1);
      if ("requestIdleCallback" in window) {
        const id = requestIdleCallback(start, { timeout: 2500 });
        cleanups.push(() => cancelIdleCallback(id));
      } else {
        const id = setTimeout(start, 1200);
        cleanups.push(() => clearTimeout(id));
      }
    }

    // Case clips. The body clip fades out when it ends, revealing the case image under it.
    const run = (video: HTMLVideoElement, fadeOut: boolean) => {
      video.currentTime = 0;
      video.onended = fadeOut ? () => video.classList.remove("is-on") : null;
      play(video).then((ok) => ok && video.classList.add("is-on"));
    };
    const stop = (video: HTMLVideoElement) => {
      video.pause();
      video.classList.remove("is-on");
    };
    document.querySelectorAll<HTMLDetailsElement>(".wh-case").forEach((card) => {
      const thumb = card.querySelector<HTMLVideoElement>("[data-wm-thumb]");
      const body = card.querySelector<HTMLVideoElement>("[data-wm-clip]");
      const summary = card.querySelector("summary");
      if (!thumb || !body || !summary) return;
      listen(summary, "pointerenter", () => finePointer.matches && !card.open && run(thumb, false));
      listen(summary, "pointerleave", () => stop(thumb));
      listen(card, "toggle", () => {
        stop(thumb);
        if (card.open) run(body, true);
        else stop(body);
      });
      // A card that is open on load plays its clip the first time it comes into view.
      if (card.open) {
        let done = false;
        observe(body, (entry) => {
          if (entry.isIntersecting && !done && card.open) {
            done = true;
            run(body, true);
          }
        });
      }
    });

    // Brain clip (hidden on phones, where its small text can't be read).
    const brain = document.querySelector<HTMLVideoElement>("[data-wm-brain]");
    const replay = document.querySelector<HTMLButtonElement>("[data-wm-replay]");
    if (brain && replay) {
      let done = false;
      const runBrain = (force: boolean) => {
        brain.currentTime = 0;
        play(brain, force).then((ok) => ok && brain.classList.add("is-on"));
      };
      listen(brain, "ended", () => replay.classList.add("is-shown"));
      listen(replay, "click", () => runBrain(true));
      observe(brain, (entry) => {
        if (!entry.isIntersecting) return brain.pause();
        if (!done && brain.offsetParent) {
          done = true;
          runBrain(false);
        }
      }, 0.5);
    }

    // Phone register bar (CSS keeps it off screen until this shows it).
    const sticky = document.querySelector<HTMLElement>(".wh-sticky");
    const heroButton = document.querySelector(".wh-hero .button");
    // The form itself renders on the client (Suspense), so watch its server-rendered section.
    const form = document.querySelector(".webinar-split--form");
    if (sticky && heroButton && form) {
      let pastHero = false;
      let atForm = false;
      const sync = () => sticky.classList.toggle("is-shown", pastHero && !atForm);
      observe(heroButton, (entry) => {
        pastHero = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        sync();
      }, 0);
      observe(form, (entry) => {
        atForm = entry.isIntersecting;
        sync();
      }, 0.15);
      cleanups.push(() => sticky.classList.remove("is-shown"));
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
