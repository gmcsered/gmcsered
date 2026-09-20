import "dotenv/config";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { access, mkdir, readFile, readdir, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { processSundayImage, sourceFileHash } from "./sunday-image-processor.mjs";
import { findPublishedPhotoByHash, mergeSundayGallery } from "./sunday-gallery-state.mjs";

const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = path.join(rootDirectory, "content", "sunday-galleries");
const publicSundayDirectory = path.join(rootDirectory, "public", "content", "sundays");
const sundaysPath = path.join(rootDirectory, "src", "content", "sundays.json");
const mediaConfigPath = path.join(rootDirectory, "src", "content", "mediaConfig.json");
const supportedInputExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"]);
const r2EnvKeys = ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET_NAME", "R2_PUBLIC_BASE_URL"];
const slovakMonths = ["január", "február", "marec", "apríl", "máj", "jún", "júl", "august", "september", "október", "november", "december"];

function sourceFolderLabel(date) {
  return `content/sunday-galleries/${date}/`;
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function assertValidSundayDate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`Priečinok "${date}" musí mať formát YYYY-MM-DD, napr. 2026-09-20.`);
  }

  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.valueOf()) || parsed.toISOString().slice(0, 10) !== date) {
    throw new Error(`Priečinok "${date}" nemá platný dátum.`);
  }
  if (parsed.getUTCDay() !== 0) {
    throw new Error(`Dátum "${date}" nie je nedeľa. Použite dátum nedeľnej bohoslužby.`);
  }
}

function formatSundayTitle(date) {
  const [year, month, day] = date.split("-").map(Number);
  return `${day}. ${slovakMonths[month - 1]} ${year}`;
}

function naturalCompare(left, right) {
  return left.localeCompare(right, "sk", { numeric: true, sensitivity: "base" });
}

function normalizeBaseUrl(value) {
  return value.replace(/\/+$/, "");
}

function requireR2Environment() {
  const missing = r2EnvKeys.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(
      [
        "Na nahratie nedeľných fotiek chýbajú lokálne Cloudflare R2 údaje.",
        `Doplňte do lokálneho .env: ${missing.join(", ")}.`,
        "Bez R2 údajov možno web stále buildnúť, ale nové nedeľné fotky sa nedajú publikovať.",
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

async function readJson(filePath, fallback) {
  if (!(await exists(filePath))) return fallback;
  return JSON.parse(await readFile(filePath, "utf8"));
}

async function writeJsonAtomic(filePath, value) {
  await mkdir(path.dirname(filePath), { recursive: true });
  const temporaryPath = `${filePath}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`);
  await rename(temporaryPath, filePath);
}

async function listSundayDates(argumentDate) {
  if (argumentDate) {
    assertValidSundayDate(argumentDate);
    const directory = path.join(sourceRoot, argumentDate);
    if (!(await exists(directory))) throw new Error(`Chýba priečinok s fotkami: ${sourceFolderLabel(argumentDate)}`);
    return [argumentDate];
  }

  if (!(await exists(sourceRoot))) return [];

  const entries = await readdir(sourceRoot, { withFileTypes: true });
  const dates = entries
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .map((entry) => entry.name)
    .sort((left, right) => right.localeCompare(left));

  for (const date of dates) assertValidSundayDate(date);
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
    throw new Error(`Priečinok obsahuje nepodporované súbory: ${unsupported.join(", ")}. Podporované sú .jpg, .jpeg, .png, .webp, .heic a .heif.`);
  }

  return images.sort(naturalCompare);
}

async function publicMediaBaseUrl() {
  const mediaConfig = await readJson(mediaConfigPath, { publicMediaBaseUrl: "" });
  const baseUrl = process.env.R2_PUBLIC_BASE_URL || mediaConfig.publicMediaBaseUrl;
  if (!baseUrl) throw new Error("Chýba R2_PUBLIC_BASE_URL v .env aj publicMediaBaseUrl v src/content/mediaConfig.json.");
  return normalizeBaseUrl(baseUrl);
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

function photoFromR2Keys(baseUrl, { fullKey, thumbnailKey }, date, index, hash) {
  return {
    hash,
    thumbnail: `${baseUrl}/${thumbnailKey}`,
    full: `${baseUrl}/${fullKey}`,
    alt: `Fotografia z GMC Sereď, ${formatSundayTitle(date)}, ${index + 1}`,
  };
}

async function uploadSunday(date, { dryRun }) {
  const sourceDirectory = path.join(sourceRoot, date);
  const images = await listSourceImages(sourceDirectory);
  if (!images.length) throw new Error(`Priečinok ${sourceFolderLabel(date)} neobsahuje žiadne fotky.`);

  const baseUrl = await publicMediaBaseUrl();
  if (dryRun) {
    let processedCount = 0;
    for (const sourceName of images) {
      await processSundayImage(path.join(sourceDirectory, sourceName), sourceName);
      processedCount += 1;
    }
    console.log(`Test spracovania: ${processedCount} fotografií OK`);
    console.log("Testovací režim: R2 upload ani manifest neboli zmenené.");
    return { date, photoCount: images.length, processedCount };
  }

  const manifestPath = path.join(publicSundayDirectory, `${date}.json`);
  const existingManifest = await readJson(manifestPath, null);
  const archive = await readJson(sundaysPath, { sundays: [] });
  const existingSummary = archive.sundays.find((sunday) => sunday.date === date) ?? null;
  const existingPhotos = Array.isArray(existingManifest?.photos) ? existingManifest.photos : [];
  const incomingPhotos = [];
  let client = null;
  let duplicatesSkipped = 0;
  let r2Uploads = 0;

  for (const sourceName of images) {
    const sourcePath = path.join(sourceDirectory, sourceName);
    const signature = await sourceFileHash(sourcePath);
    if (findPublishedPhotoByHash([...existingPhotos, ...incomingPhotos], signature)) {
      duplicatesSkipped += 1;
      continue;
    }

    if (!client) client = createR2Client();
    const keyHash = signature.slice(0, 24);
    const fullKey = `sundays/${date}/${keyHash}.webp`;
    const thumbnailKey = `sundays/${date}/thumbs/${keyHash}.webp`;
    const { full, thumbnail } = await processSundayImage(sourcePath, sourceName);
    await uploadBuffer(client, fullKey, full);
    await uploadBuffer(client, thumbnailKey, thumbnail);
    r2Uploads += 2;
    incomingPhotos.push(photoFromR2Keys(baseUrl, { fullKey, thumbnailKey }, date, existingPhotos.length + incomingPhotos.length, signature));
  }

  const merged = mergeSundayGallery({
    date,
    title: formatSundayTitle(date),
    existingManifest,
    existingSummary,
    incomingPhotos,
  });
  duplicatesSkipped += merged.duplicatesSkipped;
  const updatedSundays = [merged.summary, ...archive.sundays.filter((sunday) => sunday.date !== date)].sort((left, right) =>
    right.date.localeCompare(left.date),
  );

  await writeJsonAtomic(manifestPath, merged.manifest);
  await writeJsonAtomic(sundaysPath, { sundays: updatedSundays });

  console.log(`\nNedeľná galéria: ${merged.summary.title}`);
  console.log(`Už publikované fotografie: ${merged.existingCount}`);
  console.log(`Lokálne pridané fotografie: ${images.length}`);
  console.log(`Nové fotografie: ${merged.newCount}`);
  console.log(`Preskočené duplicity: ${duplicatesSkipped}`);
  console.log(`Konečný počet fotografií: ${merged.manifest.photos.length}`);
  console.log(`R2 upload: ${r2Uploads} objektov (${merged.newCount} plných + ${merged.newCount} náhľadov)`);
  console.log("Manifest galérie aktualizovaný.");
  console.log(`Nedeľa ${merged.summary.title} je pripravená na build.`);

  return { date, photoCount: merged.manifest.photos.length, newCount: merged.newCount, duplicatesSkipped, r2Uploads };
}

function parseArguments() {
  const argumentsList = process.argv.slice(2);
  const dryRun = argumentsList.includes("--dry-run");
  const dateArguments = argumentsList.filter((argument) => argument !== "--dry-run");
  if (dateArguments.length > 1) throw new Error("Použite najviac jeden dátum, napr. npm run sunday:upload -- 2026-09-20.");
  return { dryRun, dateArgument: dateArguments[0] };
}

async function main() {
  const { dryRun, dateArgument } = parseArguments();
  const dates = await listSundayDates(dateArgument);
  if (!dates.length) {
    console.log("Nenašiel som žiadne nedeľné galérie v content/sunday-galleries/. Pokračujem bez uploadu.");
    return;
  }

  for (const date of dates) await uploadSunday(date, { dryRun });
}

main().catch((error) => {
  console.error(`Chyba nedeľnej galérie: ${error.message}`);
  process.exitCode = 1;
});
