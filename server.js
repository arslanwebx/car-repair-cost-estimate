const { createServer } = require("node:http");
const next = require("next");

const dev = process.env.NODE_ENV === "development";
const hostname = "0.0.0.0";
const port = Number(process.env.PORT || 3000);
if (!Number.isInteger(port) || port < 1 || port > 65_535) {
  console.error("Carspect cannot start: PORT must be an integer between 1 and 65535.");
  process.exitCode = 1;
  return;
}
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((request, response) => handle(request, response));
  server.keepAliveTimeout = 5_000;
  server.headersTimeout = 10_000;
  server.requestTimeout = 120_000;
  server.maxRequestsPerSocket = 100;
  server.once("error", (error) => {
    console.error("Carspect server error", error);
    process.exitCode = 1;
  });
  server.listen(port, hostname, () => {
    console.log(`Carspect ready on ${hostname}:${port}`);
  });
  let shuttingDown = false;
  const close = (signal) => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`Carspect received ${signal}; stopping cleanly.`);
    const forceClose = setTimeout(() => {
      console.error("Carspect shutdown timed out; forcing remaining connections closed.");
      server.closeAllConnections?.();
      process.exit(1);
    }, 10_000);
    forceClose.unref();
    server.closeIdleConnections?.();
    server.close(async (error) => {
      let cleanupFailed = Boolean(error);
      try {
        if (typeof app.close === "function") await app.close();
      } catch (closeError) {
        console.error("Carspect application cleanup failed", closeError);
        cleanupFailed = true;
      } finally {
        clearTimeout(forceClose);
      }
      process.exitCode = cleanupFailed ? 1 : 0;
    });
  };
  process.once("SIGTERM", () => close("SIGTERM"));
  process.once("SIGINT", () => close("SIGINT"));
}).catch((error) => {
  console.error("Carspect failed to start", error);
  process.exitCode = 1;
});
