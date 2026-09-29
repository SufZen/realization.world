#!/usr/bin/env node
// Content engine — short vertical videos (9:16) animated from a draft's carousel, in its visual style.
// No voice, no stock footage, no generated imagery: the carousel's own text and diagram, built up on screen.
//
//   node tools/content/visuals/video.mjs <drafts-dir> <out-dir> [cluster-id ...]
//
// Per cluster it writes <id>/reel-1080x1920.mp4 (H.264, 30 fps, silent AAC track) for Instagram Reels,
// TikTok and YouTube Shorts. Each carousel slide becomes a scene: the slide sits in the 4:5 safe zone, with bands
// in its ground colour above and below (the platforms' buttons and captions cover those). Inside a scene the
// elements enter in reading order; in the diagram scene the drawing builds up piece by piece.
// A thin marigold progress line runs along the top.
// Needs Playwright with Chromium and ffmpeg (FFMPEG=/path/to/ffmpeg, or ffmpeg on PATH).

import { readFileSync, readdirSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { FONTS, slidesFor, launch } from "./lib.mjs";
import * as S from "./slides.mjs";

const FPS = 30, W = 1080, H = 1920, TOP = (H - 1350) / 2;
const FFMPEG = process.env.FFMPEG || "ffmpeg";

// Seconds per scene: the cover and closing are short; beats get time by the words people read; the diagram
// gets time to build. Totals land around 30 seconds.
function sceneLength(slide, i, n) {
  if (i === 0) return 3.6;
  if (i === n - 1) return 4.6;
  if (slide.html.includes("data-fit")) return 6.5;
  const read = (slide.html.match(/class="(?:d|b|pull)[^"]*"[^>]*>([^<]*)/g) ?? []).join(" ").replace(/<[^>]*>|class="[^"]*"[^>]*>/g, " ");
  const words = read.split(/\s+/).filter(Boolean).length;
  return Math.max(3.4, Math.min(5.8, 2.4 + words * 0.11));
}

function stagePage(slides, lengths) {
  const total = lengths.reduce((a, b) => a + b, 0);
  const scenes = slides.map((s, i) => `<section class="scene" data-i="${i}" style="position:absolute;inset:0;opacity:0">
    <div class="band" style="position:absolute;left:0;right:0;top:0;height:${H}px"></div>
    <div class="slide" style="position:absolute;left:0;top:${TOP}px;width:1080px;height:1350px">${s.html}</div></section>`).join("");
  return `<!doctype html><html><head><meta charset="utf-8"><style>${FONTS}*{margin:0;box-sizing:border-box}
  body{width:${W}px;height:${H}px;overflow:hidden;background:#000;-webkit-font-smoothing:antialiased}${S.CSS}
  #bar{position:absolute;left:0;top:0;height:8px;background:#FDCC33;z-index:9}</style></head>
  <body>${scenes}<div id="bar"></div>${S.FIT}<script>
  const L=${JSON.stringify(lengths)}, T=${total}, starts=L.map((_,i)=>L.slice(0,i).reduce((a,b)=>a+b,0));
  const ease=(p)=>p<=0?0:p>=1?1:1-Math.pow(1-p,3);
  const scenes=[...document.querySelectorAll('.scene')];
  let parts=[];
  function prepare(){
    parts=scenes.map((sc)=>{
      const c=sc.querySelector('.c'); sc.querySelector('.band').style.background=getComputedStyle(c).backgroundColor;
      // Reading order: labels, headings, body, pull lines, title block; then the diagram's own shapes one by one.
      const els=[...c.querySelectorAll('.bar,.d,.b,.pull,.tb,.foot,.m')].filter((e)=>!e.closest('.bar')||e.classList.contains('bar'));
      const uniq=els.filter((e,i)=>!els.some((o,j)=>j<i&&o.contains(e)));
      const svg=c.querySelector('svg[data-fit]');
      const shapes=svg?[...svg.children].filter((e)=>e.tagName!=='defs'):[];
      // Headings reveal word by word.
      for(const h of c.querySelectorAll('.d')){
        const walk=(node)=>{for(const ch of [...node.childNodes]){
          if(ch.nodeType===3&&ch.textContent.trim()){const f=document.createDocumentFragment();
            ch.textContent.split(/(\s+)/).forEach((w)=>{if(!w.trim()){f.appendChild(document.createTextNode(w));return;}const sp=document.createElement('span');sp.className='w';sp.style.display='inline-block';sp.textContent=w;f.appendChild(sp);});
            ch.replaceWith(f);} else if(ch.nodeType===1) walk(ch);}};
        walk(h);
      }
      return {uniq,shapes,slide:sc.querySelector('.slide')};
    });
  }
  window.render=(t)=>{
    document.getElementById('bar').style.width=(100*Math.min(t/T,1))+'%';
    scenes.forEach((sc,i)=>{
      const lt=t-starts[i], d=L[i];
      const fadeIn=i===0?1:ease(lt/0.35), fadeOut=i===scenes.length-1?1:1-ease((lt-(d-0.3))/0.3);
      sc.style.opacity=(lt<0||lt>d)?0:Math.min(fadeIn,fadeOut);
      if(lt<0||lt>d) return;
      const {uniq,shapes,slide}=parts[i];
      slide.style.transform='scale('+(1+0.035*Math.min(lt/d,1))+')';
      uniq.forEach((e,k)=>{
        const s0=0.15+k*0.22;
        const ws=e.classList.contains('d')?[...e.querySelectorAll('.w')]:[];
        if(ws.length){e.style.opacity=1;ws.forEach((w,j)=>{const p=ease((lt-s0-j*0.07)/0.45);w.style.opacity=p;w.style.transform='translateY('+((1-p)*28)+'px)';});return;}
        const p=ease((lt-s0)/0.55); e.style.opacity=p; e.style.transform='translateY('+((1-p)*36)+'px)';});
      const t0=0.9, step=Math.min(0.09,3.2/Math.max(shapes.length,1));
      shapes.forEach((e,k)=>{const p=ease((lt-t0-k*step)/0.4); e.style.opacity=p;});
    });
  };
  document.fonts.ready.then(()=>new Promise((r)=>{const w=()=>document.body.dataset.ready==='1'?r():setTimeout(w,20);w();})).then(()=>{prepare();window.render(0);document.body.dataset.stage='1';});
  </script></body></html>`;
}

const [draftsDir, outDir, ...only] = process.argv.slice(2);
if (!draftsDir || !outDir) {
  console.error("Usage: node tools/content/visuals/video.mjs <drafts-dir> <out-dir> [cluster-id ...]");
  process.exit(1);
}
const browser = await launch();
const files = readdirSync(draftsDir).filter((f) => f.endsWith(".json") && (!only.length || only.some((o) => f.startsWith(o))));
for (const f of files) {
  const d = JSON.parse(readFileSync(join(draftsDir, f), "utf8"));
  const { carousel } = slidesFor(d);
  const lengths = carousel.map((sl, i) => sceneLength(sl, i, carousel.length));
  const total = lengths.reduce((a, b) => a + b, 0);
  const dir = join(outDir, d.cluster_id), frames = join(dir, ".frames");
  rmSync(frames, { recursive: true, force: true });
  mkdirSync(frames, { recursive: true });
  const p = await browser.newPage({ viewport: { width: W, height: H } });
  await p.setContent(stagePage(carousel, lengths), { waitUntil: "load" });
  await p.waitForFunction(() => document.body.dataset.stage === "1");
  const n = Math.round(total * FPS);
  for (let k = 0; k < n; k++) {
    await p.evaluate((t) => window.render(t), k / FPS);
    await p.screenshot({ path: join(frames, `${String(k).padStart(5, "0")}.jpg`), type: "jpeg", quality: 92 });
  }
  await p.close();
  const out = join(dir, "reel-1080x1920.mp4");
  execFileSync(FFMPEG, ["-y", "-loglevel", "error", "-framerate", String(FPS), "-i", join(frames, "%05d.jpg"),
    "-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=44100", "-shortest",
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "20", "-preset", "medium", "-movflags", "+faststart",
    "-c:a", "aac", "-b:a", "96k", out]);
  rmSync(frames, { recursive: true, force: true });
  console.log(`${d.cluster_id}: ${total.toFixed(1)} s, ${carousel.length} scenes → ${out}`);
}
await browser.close();
