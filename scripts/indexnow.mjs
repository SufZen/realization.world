// Notify IndexNow search engines (Bing, Yandex, Seznam, Naver; Bing shares with ChatGPT/Copilot search)
// that pages changed. Run after a deploy:  npm run indexnow            (all sitemap URLs)
//                                         npm run indexnow -- /work/x  (specific paths)
const host = "realization.world";
const key = "10c0a27e3603478afbc57ab1ac119628"; // public/<key>.txt proves ownership; not a secret.

const paths = process.argv.slice(2);
let urls;
if (paths.length) {
  urls = paths.map((path) => `https://${host}${path.startsWith("/") ? path : `/${path}`}`);
} else {
  const xml = await (await fetch(`https://${host}/sitemap.xml`)).text();
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key, keyLocation: `https://${host}/${key}.txt`, urlList: urls }),
});
console.log(`IndexNow: ${response.status} ${response.statusText} for ${urls.length} URLs`);
if (!response.ok && response.status !== 202) process.exit(1);
