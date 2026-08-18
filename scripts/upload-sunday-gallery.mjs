import "dotenv/config";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createHash } from "node:crypto";
import { access, mkdir, readFile, readdir, rename, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const importRoot = path.join(rootDirectory, "content-import", "sundays");
const processedRoot = path.join(rootDirectory, "content-import", ".processed-sundays");
const publicSundayDirectory = path.join(rootDirectory, "public", "content", "sundays");
const sundaysPath = path.join(rootDirectory, "src", "content", "sundays.json");
const supportedInputExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"]);
const r2EnvKeys = ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET_NAME", "R2_PUBLIC_BASE_URL"];

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function assertValidSundayDate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`Dátum "${date}" musí byť vo formáte YYYY-MM-DD, napr. 2026-08-23.`);
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.valueOf()) || parsed.toISOString().slice(0, 10) !== date) {
    throw new Error(`Dátum "${date}" nie je platná nedeľa/dátum.`);
  }
}

function normalizeBaseUrl(value) {
  return value.replace(/\/+$/, "");
}

function formatSundayTitle(date) {
  const [year, month, day] = date.split("-").map(Number);
  return `Nedeľa ${day}. ${month}. ${year}`;
}

function naturalCompare(left, right) {
  return left.localeCompare(right, "sk", { numeric: true, sensitivity: "base" });
}

function requireR2Environment() {
  const missing = r2EnvKeys.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(
      [
        "Na nahratie nedeľných fotiek chýbajú lokálne Cloudflare R2 údaje.",
        `Doplňte do lokálneho .env: ${missing.join(", ")}.`,
        "Bez R2 údajov je stále možné spustiť npm run build, ale nové nedeľné fotky sa nedajú nahrať.",
      ].join("\n"),
    );
  }
}

function createR2Client() {
  requireR2Environment();
  return new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    forcePathStyle: true,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });
}

async function listSundayDates(argumentDate) {
  if (argumentDate) {
    assertValidSundayDate(argumentDate);
    const directory = path.join(importRoot, argumentDate);
    if (!(await exists(directory))) throw new Error(`Chýba priečinok s fotkami: content-import/sundays/${argumentDate}/`);
    return [argumentDate];
  }

  if (!(await exists(importRoot))) {
    console.log("Nenašiel som žiadne nové nedeľné fotky v content-import/sundays/. Pokračujem bez R2 uploadu.");
    return [];
  }

  const entries = await readdir(importRoot, { withFileTypes: true });
  const dates = entries
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .map((entry) => entry.name)
    .sort((left, right) => right.localeCompare(left));

  for (const date of dates) assertValidSundayDate(date);
  if (!dates.length) console.log("Nenašiel som žiadne nové nedeľné fotky v content-import/sundays/. Pokračujem bez R2 uploadu.");
  return dates;
}

async function listSourceImages(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const unsupported = [];
  const images = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    if (!entry.isFile()) continue;

    const extension = path.extname(entry.name).toLowerCase();
    if (!supportedInputExtensions.has(extension)) {
      unsupported.push(entry.name);
      continue;
    }
    images.push(entry.name);
  }

  if (unsupported.length) {
    throw new Error(`Priečinok obsahuje nepodporované súbory: ${unsupported.join(", ")}. Podporované sú .jpg, .jpeg, .png, .webp, .heic, .heif.`);
  }

  return images.sort(naturalCompare);
}

async function fileSignature(filePath, name) {
  const info = await stat(filePath);
  const hash = createHash("sha1");
  hash.update(name);
  hash.update(String(info.size));
  hash.update(String(Math.trunc(info.mtimeMs)));
  return hash.digest("hex");
}

async function sourceSignature(directory, images) {
  const signatures = [];
  for (const image of images) {
    signatures.push(await fileSignature(path.join(directory, image), image));
  }
  return createHash("sha256").update(signatures.join("|")).digest("hex");
}

async function readJson(filePath, fallback) {
  if (!(await exists(filePath))) return fallback;
  return JSON.parse(await readFile(filePath, "utf8"));
}

async function hasExistingSundayMetadata(date) {
  const archive = await readJson(sundaysPath, { sundays: [] });
  const manifestPath = path.join(publicSundayDirectory, `${date}.json`);
  return Boolean(archive.sundays?.some((sunday) => sunday.date === date) && (await exists(manifestPath)));
}

async function writeJsonAtomic(filePath, value) {
  await mkdir(path.dirname(filePath), { recursive: true });
  const temporaryPath = `${filePath}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`);
  await rename(temporaryPath, filePath);
}

async function uploadBuffer(client, key, buffer) {
  await client.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: "image/webp",
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );
}

async function processImage(sourcePath, sourceName) {
  try {
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
  } catch (error) {
    const extension = path.extname(sourceName).toLowerCase();
    if (extension === ".heic" || extension === ".heif") {
      throw new Error(`HEIC/HEIF súbor "${sourceName}" sa na tomto Macu nepodarilo spracovať. Exportujte ho ako JPG a spustite upload znova.`);
    }
    throw new Error(`Fotku "${sourceName}" sa nepodarilo spracovať: ${error.message}`);
  }
}

async function uploadSunday(date) {
  const sourceDirectory = path.join(importRoot, date);
  const images = await listSourceImages(sourceDirectory);
  if (!images.length) throw new Error(`Priečinok content-import/sundays/${date}/ neobsahuje žiadne fotky.`);

  const signature = await sourceSignature(sourceDirectory, images);
  const markerPath = path.join(processedRoot, `${date}.json`);
  const marker = await readJson(markerPath, null);
  if (marker?.signature === signature && (await hasExistingSundayMetadata(date))) {
    console.log(`Nedeľa ${date}: fotky už boli úspešne spracované, preskakujem R2 upload.`);
    return;
  }

  const client = createR2Client();
  const baseUrl = normalizeBaseUrl(process.env.R2_PUBLIC_BASE_URL);
  const padLength = Math.max(3, String(images.length).length);
  const photos = [];

  console.log(`Nedeľa ${date}: spracúvam ${images.length} fotiek pre Cloudflare R2...`);

  for (const [index, sourceName] of images.entries()) {
    const outputName = `${String(index + 1).padStart(padLength, "0")}.webp`;
    const fullKey = `sundays/${date}/${outputName}`;
    const thumbnailKey = `sundays/${date}/thumbs/${outputName}`;
    const sourcePath = path.join(sourceDirectory, sourceName);

    process.stdout.write(`  ${index + 1}/${images.length} ${sourceName} → ${outputName} ... `);
    const { full, thumbnail } = await processImage(sourcePath, sourceName);
    await uploadBuffer(client, fullKey, full);
    await uploadBuffer(client, thumbnailKey, thumbnail);
    console.log("hotovo");

    photos.push({
      thumbnail: `${baseUrl}/${thumbnailKey}`,
      full: `${baseUrl}/${fullKey}`,
      alt: `Fotografia z GMC Sereď, ${formatSundayTitle(date)}, ${index + 1}`,
      sourceName,
    });
  }

  const sundayManifest = {
    date,
    title: formatSundayTitle(date),
    photos: photos.map(({ sourceName: _sourceName, ...photo }) => photo),
  };
  const manifestPublicPath = `/content/sundays/${date}.json`;
  const sundaySummary = {
    date,
    title: sundayManifest.title,
    cover: photos[0].thumbnail,
    photoCount: photos.length,
    manifest: manifestPublicPath,
  };

  const archive = await readJson(sundaysPath, { sundays: [] });
  const updatedSundays = [
    sundaySummary,
    ...archive.sundays.filter((sunday) => sunday.date !== date),
  ].sort((left, right) => right.date.localeCompare(left.date));

  await writeJsonAtomic(path.join(publicSundayDirectory, `${date}.json`), sundayManifest);
  await writeJsonAtomic(sundaysPath, { sundays: updatedSundays });
  await mkdir(processedRoot, { recursive: true });
  await writeJsonAtomic(markerPath, {
    date,
    signature,
    photoCount: photos.length,
    processedAt: new Date().toISOString(),
  });

  console.log(`Nedeľa ${date}: upload hotový, manifest aktualizovaný.`);
}

async function main() {
  const dateArgument = process.argv[2];
  const dates = await listSundayDates(dateArgument);
  for (const date of dates) await uploadSunday(date);
}

main().catch((error) => {
  console.error(`Chyba nedeľného uploadu: ${error.message}`);
  process.exitCode = 1;
});
