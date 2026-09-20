import assert from "node:assert/strict";
import test from "node:test";
import { isPublishedPublicMediaUrl, normalizePublicMediaBaseUrl } from "./public-media-config.mjs";

const customDomain = "https://media.gmcsered.sk";
const developmentUrl = "https://pub-e172f3ebbda24e5695b1cc06a43aa025.r2.dev";

test("published Sunday media accepts either the configured custom domain or Cloudflare r2.dev", () => {
  assert.equal(isPublishedPublicMediaUrl(`${customDomain}/sundays/2026-09-20/photo.webp`, customDomain), true);
  assert.equal(isPublishedPublicMediaUrl(`${developmentUrl}/sundays/2026-09-20/photo.webp`, customDomain), true);
  assert.equal(isPublishedPublicMediaUrl("/content/sundays/2026-09-20.json", customDomain), true);
  assert.equal(isPublishedPublicMediaUrl("http://pub-example.r2.dev/sundays/photo.webp", customDomain), false);
  assert.equal(isPublishedPublicMediaUrl("https://example.com/photo.webp", customDomain), false);
});

test("public media base URLs are normalized without hardcoding a deployment host", () => {
  assert.equal(normalizePublicMediaBaseUrl(`${developmentUrl}/`), developmentUrl);
  assert.equal(normalizePublicMediaBaseUrl(`${customDomain}/`), customDomain);
});
