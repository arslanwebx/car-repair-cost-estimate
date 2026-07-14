import { FlatCompat } from "@eslint/eslintrc";
import { fileURLToPath } from "node:url";
import path from "node:path";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory: dirname });

const config = [
  { ignores: [".next/**", ".open-next/**", ".wrangler/**", "node_modules/**", "coverage/**", "next-env.d.ts"] },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  { files: ["server.js"], rules: { "@typescript-eslint/no-require-imports": "off" } }
];

export default config;
