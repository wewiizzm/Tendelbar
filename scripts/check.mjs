import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const requiredFiles = [
  "index.html",
  "admin.html",
  "style.css",
  "script.js",
  "admin.js",
  "logo-animation.js",
  "logo-tendel.png",
  "api/state.js",
  "api/orders.js",
  "api/admin/login.js",
  "api/admin/logout.js",
  "api/admin/orders-access.js",
  "api/admin/state.js",
  "api/admin/orders.js",
  "api/admin/verify-password.js",
  "db/schema.sql",
  "vercel.json"
];

const jsFiles = [
  "script.js",
  "admin.js",
  "logo-animation.js",
  "api/_lib/default-state.js",
  "api/_lib/http.js",
  "api/_lib/env.js",
  "api/_lib/auth.js",
  "api/_lib/state-model.js",
  "api/_lib/store.js",
  "api/state.js",
  "api/orders.js",
  "api/admin/login.js",
  "api/admin/logout.js",
  "api/admin/orders-access.js",
  "api/admin/state.js",
  "api/admin/orders.js",
  "api/admin/verify-password.js"
];

for (const relativeFile of requiredFiles) {
  const absoluteFile = path.join(rootDir, relativeFile);
  if (!existsSync(absoluteFile)) {
    console.error(`Arquivo obrigatorio ausente: ${relativeFile}`);
    process.exit(1);
  }
}

for (const relativeFile of jsFiles) {
  const absoluteFile = path.join(rootDir, relativeFile);
  const result = spawnSync(process.execPath, ["--check", absoluteFile], { stdio: "inherit" });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

const htmlFiles = ["index.html", "admin.html"];
for (const relativeFile of htmlFiles) {
  const absoluteFile = path.join(rootDir, relativeFile);
  const html = readFileSync(absoluteFile, "utf8");
  if (html.includes("local-api.js")) {
    console.error(`Referencia antiga a local-api.js encontrada em ${relativeFile}.`);
    process.exit(1);
  }
}

const legacyStorageReferences = ["@upstash/redis", "KV_REST_API_URL", "KV_REST_API_TOKEN"];
const filesWithoutLegacyStorage = ["README.md", ".env.example", "package.json", "api/_lib/env.js", "api/_lib/store.js"];
for (const relativeFile of filesWithoutLegacyStorage) {
  const absoluteFile = path.join(rootDir, relativeFile);
  const content = readFileSync(absoluteFile, "utf8");
  for (const legacyReference of legacyStorageReferences) {
    if (content.includes(legacyReference)) {
      console.error(`Referencia antiga de persistencia encontrada em ${relativeFile}: ${legacyReference}`);
      process.exit(1);
    }
  }
}

const vercelConfigPath = path.join(rootDir, "vercel.json");
const vercelConfig = JSON.parse(readFileSync(vercelConfigPath, "utf8"));
if (vercelConfig.$schema !== "https://openapi.vercel.sh/vercel.json") {
  console.error("O arquivo vercel.json deve usar o schema oficial da Vercel.");
  process.exit(1);
}

const forbiddenVercelKeys = ["builds", "buildCommand", "outputDirectory", "env", "build"];
for (const forbiddenKey of forbiddenVercelKeys) {
  if (Object.prototype.hasOwnProperty.call(vercelConfig, forbiddenKey)) {
    console.error(`Configuracao nao permitida em vercel.json para este projeto simples: ${forbiddenKey}`);
    process.exit(1);
  }
}

console.log("Projeto verificado com sucesso.");
