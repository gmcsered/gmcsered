import assert from "node:assert/strict";
import test from "node:test";
import { access, mkdtemp, readdir, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { createWebpVariants, processSundayImage, sourceFileHash } from "./sunday-image-processor.mjs";

const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sundaySourceRoot = path.join(rootDirectory, "content", "sunday-galleries");

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function findLocalHeic() {
  if (!(await exists(sundaySourceRoot))) return null;
  const dates = await readdir(sundaySourceRoot, { withFileTypes: true });
  for (const date of dates.filter((entry) => entry.isDirectory() && !entry.name.startsWith(".")).sort((left, right) => left.name.localeCompare(right.name))) {
    const directory = path.join(sundaySourceRoot, date.name);
    const images = await readdir(directory, { withFileTypes: true });
    const image = images.find((entry) => entry.isFile() && [".heic", ".heif"].includes(path.extname(entry.name).toLowerCase()));
    if (image) return path.join(directory, image.name);
  }
  return null;
}

test("macOS sips fallback turns a local HEIC into WebP without touching the original", async (t) => {
  const sourcePath = await findLocalHeic();
  if (process.platform !== "darwin" || !(await exists("/usr/bin/sips")) || !sourcePath) {
    t.skip("requires a local macOS HEIC/HEIF source and sips");
    return;
  }

  const sourceDirectoryBefore = (await readdir(path.dirname(sourcePath))).sort();
  const sourceStatBefore = await stat(sourcePath);
  const sourceHashBefore = await sourceFileHash(sourcePath);
  const temporaryRoot = await mkdtemp(path.join(tmpdir(), "gmc-heic-test-"));

  try {
    const result = await processSundayImage(sourcePath, path.basename(sourcePath), {
      temporaryRoot,
      createVariants: async (inputPath) => {
        if (inputPath === sourcePath) throw new Error("simulated Sharp HEIC decoder failure");
        return createWebpVariants(inputPath);
      },
    });

    const fullMetadata = await sharp(result.full).metadata();
    const thumbnailMetadata = await sharp(result.thumbnail).metadata();
    const sourceStatAfter = await stat(sourcePath);

    assert.equal(result.usedSipsFallback, true);
    assert.equal(await sourceFileHash(sourcePath), sourceHashBefore);
    assert.equal(sourceStatAfter.size, sourceStatBefore.size);
    assert.equal(sourceStatAfter.mtimeMs, sourceStatBefore.mtimeMs);
    assert.deepEqual((await readdir(path.dirname(sourcePath))).sort(), sourceDirectoryBefore);
    assert.ok(fullMetadata.width <= 2000 && fullMetadata.height <= 2000);
    assert.ok(thumbnailMetadata.width <= 700 && thumbnailMetadata.height <= 700);
    assert.deepEqual(await readdir(temporaryRoot), []);
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
});
