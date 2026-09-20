import assert from "node:assert/strict";
import test from "node:test";
import { findPublishedPhotoByHash, mergeSundayGallery } from "./sunday-gallery-state.mjs";

const date = "2026-09-20";
const title = "20. september 2026";
const baseUrl = "https://media.gmcsered.sk";

function photo(hash, label) {
  return {
    hash,
    thumbnail: `${baseUrl}/sundays/${date}/thumbs/${hash.slice(0, 24)}.webp`,
    full: `${baseUrl}/sundays/${date}/${hash.slice(0, 24)}.webp`,
    alt: label,
  };
}

test("Sunday galleries merge incoming photos additively and retain a historic cover", () => {
  const hashes = ["a".repeat(64), "b".repeat(64), "c".repeat(64), "d".repeat(64), "e".repeat(64)];
  const initial = mergeSundayGallery({
    date,
    title,
    existingManifest: null,
    existingSummary: null,
    incomingPhotos: [photo(hashes[0], "prvá"), photo(hashes[1], "druhá"), photo(hashes[2], "tretia")],
  });

  assert.equal(initial.manifest.photos.length, 3);
  assert.equal(initial.summary.cover, initial.manifest.photos[0].thumbnail);

  const afterSourcesRemoved = mergeSundayGallery({
    date,
    title,
    existingManifest: initial.manifest,
    existingSummary: initial.summary,
    incomingPhotos: [],
  });
  assert.deepEqual(afterSourcesRemoved.manifest.photos, initial.manifest.photos);

  const withAdditions = mergeSundayGallery({
    date,
    title,
    existingManifest: afterSourcesRemoved.manifest,
    existingSummary: afterSourcesRemoved.summary,
    incomingPhotos: [photo(hashes[3], "štvrtá"), photo(hashes[4], "piata")],
  });

  assert.equal(withAdditions.existingCount, 3);
  assert.equal(withAdditions.newCount, 2);
  assert.equal(withAdditions.manifest.photos.length, 5);
  assert.equal(withAdditions.summary.cover, initial.summary.cover);
  assert.deepEqual(
    withAdditions.manifest.photos.map((item) => item.hash),
    hashes,
  );
});

test("a historical 24-character R2 hash prevents a duplicate with a renamed source file", () => {
  const fullHash = "f".repeat(64);
  const legacyManifest = {
    date,
    title,
    photos: [
      {
        thumbnail: `${baseUrl}/sundays/${date}/thumbs/${fullHash.slice(0, 24)}.webp`,
        full: `${baseUrl}/sundays/${date}/${fullHash.slice(0, 24)}.webp`,
        alt: "pôvodný názov",
      },
    ],
  };

  const result = mergeSundayGallery({
    date,
    title,
    existingManifest: legacyManifest,
    existingSummary: { date, title, cover: legacyManifest.photos[0].thumbnail, photoCount: 1, manifest: `/content/sundays/${date}.json` },
    incomingPhotos: [photo(fullHash, "nový názov súboru")],
  });

  assert.equal(result.newCount, 0);
  assert.equal(result.duplicatesSkipped, 1);
  assert.equal(result.manifest.photos.length, 1);
  assert.equal(result.manifest.photos[0].hash, fullHash.slice(0, 24));
  assert.ok(findPublishedPhotoByHash(result.manifest.photos, fullHash));
});
