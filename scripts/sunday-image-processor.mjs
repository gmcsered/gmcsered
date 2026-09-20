import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { access, mkdtemp, readFile, rm } from "node:fs/promises";
import { promisify } from "node:util";
import path from "node:path";
import { tmpdir } from "node:os";
import sharp from "sharp";

const execFileAsync = promisify(execFile);

function isHeic(sourceName) {
  const extension = path.extname(sourceName).toLowerCase();
  return extension === ".heic" || extension === ".heif";
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function sourceFileHash(filePath) {
  return createHash("sha256").update(await readFile(filePath)).digest("hex");
}

export async function createWebpVariants(sourcePath) {
  const basePipeline = sharp(sourcePath, { failOn: "warning" }).rotate();
  const full = await basePipeline
    .clone()
    .resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 83 })
    .toBuffer();
  const thumbnail = await basePipeline
    .clone()
    .resize({ width: 700, height: 700, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  return { full, thumbnail };
}

async function convertHeicWithSips(sourcePath, temporaryPath) {
  try {
    await execFileAsync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "best", sourcePath, "--out", temporaryPath], {
      maxBuffer: 1024 * 1024,
    });
  } catch (error) {
    if (error?.code === "ENOENT") throw new Error("macOS nástroj sips nie je dostupný.");
    const details = String(error?.stderr || error?.message || "neznáma chyba").trim();
    throw new Error(`macOS sips nevedel vytvoriť dočasný JPEG (${details}).`);
  }

  if (!(await exists(temporaryPath))) throw new Error("macOS sips nevytvoril dočasný JPEG.");
}

export async function processSundayImage(sourcePath, sourceName, { temporaryRoot = tmpdir(), createVariants = createWebpVariants } = {}) {
  try {
    return { ...(await createVariants(sourcePath)), usedSipsFallback: false };
  } catch (sharpError) {
    if (!isHeic(sourceName)) {
      throw new Error(`Fotku "${sourceName}" sa nepodarilo spracovať: ${sharpError.message}`);
    }

    if (process.platform !== "darwin") {
      throw new Error(`HEIC/HEIF súbor "${sourceName}" sa nepodarilo spracovať cez Sharp a sips je dostupný iba v macOS.`);
    }

    let temporaryDirectory = null;
    try {
      temporaryDirectory = await mkdtemp(path.join(temporaryRoot, "gmc-heic-"));
      const temporaryJpeg = path.join(temporaryDirectory, "converted.jpg");
      await convertHeicWithSips(sourcePath, temporaryJpeg);
      return { ...(await createVariants(temporaryJpeg)), usedSipsFallback: true };
    } catch (fallbackError) {
      throw new Error(
        `HEIC/HEIF súbor "${sourceName}" sa nepodarilo spracovať cez Sharp ani cez macOS sips. ${fallbackError.message}`,
      );
    } finally {
      if (temporaryDirectory) await rm(temporaryDirectory, { recursive: true, force: true }).catch(() => undefined);
    }
  }
}
