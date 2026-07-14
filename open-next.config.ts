import { defineCloudflareConfig } from "@opennextjs/cloudflare";

const config = defineCloudflareConfig();

// Keep the public `npm run build` command Cloudflare-ready. OpenNext must use a
// separate command for the underlying Next.js compilation to avoid recursively
// invoking itself when Workers Builds uses the repository's default build.
config.buildCommand = "npm run build:next";

export default config;
