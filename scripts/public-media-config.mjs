import "dotenv/config";
import { readFile } from "node:fs/promises";

export function normalizePublicMediaBaseUrl(value) {
  const baseUrl = String(value ?? "").trim().replace(/\/+$/, "");
  if (!baseUrl) return "";

  let parsed;
  try {
    parsed = new URL(baseUrl);
  } catch {
    throw new Error(`Neplatná verejná R2 URL: ${baseUrl}.`);
  }
  if (parsed.protocol !== "https:") throw new Error("Verejná R2 URL musí používať https.");
  return baseUrl;
}

export async function configuredPublicMediaBaseUrl(mediaConfigPath) {
  const mediaConfig = JSON.parse(await readFile(mediaConfigPath, "utf8"));
  const baseUrl = process.env.R2_PUBLIC_BASE_URL || mediaConfig.publicMediaBaseUrl;
  const normalizedBaseUrl = normalizePublicMediaBaseUrl(baseUrl);
  if (!normalizedBaseUrl) {
    throw new Error("Chýba R2_PUBLIC_BASE_URL v .env aj publicMediaBaseUrl v src/content/mediaConfig.json.");
  }
  return normalizedBaseUrl;
}

export function isConfiguredPublicMediaUrl(value, publicMediaBaseUrl) {
  return typeof value === "string" && value.startsWith(`${publicMediaBaseUrl}/`);
}

export function isPublishedPublicMediaUrl(value, publicMediaBaseUrl) {
  if (typeof value !== "string") return false;
  if (value.startsWith("/")) return true;
  if (isConfiguredPublicMediaUrl(value, publicMediaBaseUrl)) return true;

  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.endsWith(".r2.dev");
  } catch {
    return false;
  }
}
