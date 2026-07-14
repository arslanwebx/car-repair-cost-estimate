const debugOrigin = process.env.EDGE_DEBUG_ORIGIN ?? "http://127.0.0.1:9223";
const siteOrigin = process.env.RESPONSIVE_VALIDATE_ORIGIN ?? "http://127.0.0.1:3015";
const targets = await fetch(`${debugOrigin}/json/list`).then((response) => response.json());
const target = targets.find((item) => item.type === "page");
if (!target?.webSocketDebuggerUrl) throw new Error("No debuggable browser page is available");

const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let commandId = 0;
const pending = new Map();
socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (!message.id || !pending.has(message.id)) return;
  const { resolve, reject } = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) reject(new Error(message.error.message));
  else resolve(message.result);
});

function command(method, params = {}) {
  const id = ++commandId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

await command("Page.enable");
await command("Runtime.enable");

const scenarios = [
  { name: "estimate mobile", path: "/estimate", width: 375, height: 812, mobile: true },
  { name: "sample mobile", path: "/sample-estimates/toyota-camry-front-bumper-grille", width: 375, height: 812, mobile: true },
  { name: "article desktop", path: "/blog/how-to-read-an-auto-body-repair-estimate-line-by-line", width: 1440, height: 1000, mobile: false }
];

for (const scenario of scenarios) {
  await command("Emulation.setDeviceMetricsOverride", { width: scenario.width, height: scenario.height, deviceScaleFactor: 1, mobile: scenario.mobile });
  await command("Page.navigate", { url: `${siteOrigin}${scenario.path}` });
  let ready = false;
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const state = await command("Runtime.evaluate", { expression: "document.readyState", returnByValue: true });
    if (state.result.value === "complete") { ready = true; break; }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  if (!ready) throw new Error(`${scenario.name} did not finish loading`);
  const evaluated = await command("Runtime.evaluate", {
    expression: `(async () => { await document.fonts.ready; return { viewportWidth: innerWidth, documentWidth: document.documentElement.scrollWidth, h1Count: document.querySelectorAll('h1').length, h1: document.querySelector('h1')?.textContent?.trim(), brokenImages: [...document.images].filter(image => image.complete && image.naturalWidth === 0).length }; })()`,
    awaitPromise: true,
    returnByValue: true
  });
  const result = evaluated.result.value;
  if (result.viewportWidth !== scenario.width) throw new Error(`${scenario.name} viewport is ${result.viewportWidth}, expected ${scenario.width}`);
  if (result.documentWidth > result.viewportWidth + 1) throw new Error(`${scenario.name} overflows horizontally: ${result.documentWidth}px in ${result.viewportWidth}px`);
  if (result.h1Count !== 1) throw new Error(`${scenario.name} has ${result.h1Count} H1 elements`);
  if (result.brokenImages) throw new Error(`${scenario.name} has ${result.brokenImages} broken images`);
  console.log(`${scenario.name}: ${result.viewportWidth}px viewport, no overflow, one H1 (${result.h1}).`);
}

socket.close();
