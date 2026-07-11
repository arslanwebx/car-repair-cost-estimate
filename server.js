const { createServer } = require("node:http");
const next = require("next");

const dev = process.env.NODE_ENV === "development";
const hostname = "0.0.0.0";
const port = Number(process.env.PORT || 3000);
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((request, response) => handle(request, response));
  server.keepAliveTimeout = 65_000;
  server.headersTimeout = 66_000;
  server.listen(port, hostname, () => {
    console.log(`Carspect ready on ${hostname}:${port}`);
  });
  const close = () => server.close(() => process.exit(0));
  process.on("SIGTERM", close);
  process.on("SIGINT", close);
}).catch((error) => {
  console.error("Carspect failed to start", error);
  process.exit(1);
});
