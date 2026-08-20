import { access, mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDirectory = path.join(rootDirectory, "public");
const galleryDirectory = path.join(publicDirectory, "content", "gallery");
const sundayManifestDirectory = path.join(publicDirectory, "content", "sundays");
const manifestPath = path.join(rootDirectory, "src", "generated", "gallery-manifest.json");
const categoriesPath = path.join(rootDirectory, "src", "content", "galleryCategories.json");
const programTextPath = path.join(publicDirectory, "content", "program", "program.txt");
const programPath = path.join(rootDirectory, "src", "content", "program.json");
const sundaysPath = path.join(rootDirectory, "src", "content", "sundays.json");
const mediaConfigPath = path.join(rootDirectory, "src", "content", "mediaConfig.json");
const supportedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const allowedCategoryIds = ["spolocny-cas", "deti-mladez", "chvaly-slovo", "family-days"];
const obsoleteCategoryIds = ["children", "community", "fellowship", "music", "worship"];
const warnings = [];
const isCheck = process.argv.includes("--check");

const compareNames = (left, right) => {
  const leftDate = /(^|\/)(\d{4}-\d{2}-\d{2})(?:-|\.)/.exec(left)?.[2];
  const rightDate = /(^|\/)(\d{4}-\d{2}-\d{2})(?:-|\.)/.exec(right)?.[2];

  if (leftDate && rightDate && leftDate !== rightDate) return rightDate.localeCompare(leftDate);
  if (leftDate && !rightDate) return -1;
  if (!leftDate && rightDate) return 1;

  return left.localeCompare(right, "sk", { numeric: true, sensitivity: "base" });
};

const isHidden = (name) => name.startsWith(".");

async function collectImages(directory, relativeDirectory = "") {
  const entries = await readdir(directory, { withFileTypes: true });
  const photos = [];

  for (const entry of entries) {
    if (isHidden(entry.name)) continue;

    const relativePath = path.posix.join(relativeDirectory, entry.name);
    const absolutePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      photos.push(...(await collectImages(absolutePath, relativePath)));
      continue;
    }

    if (!entry.isFile()) continue;
    if (!supportedExtensions.has(path.extname(entry.name).toLowerCase())) {
      warnings.push(`Nepodporovaný súbor galérie: public/content/gallery/${relativePath}`);
      continue;
    }

    photos.push(relativePath);
  }

  return photos.sort(compareNames);
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function stableJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function parseProgramText(source) {
  const normalized = source.replace(/\r\n/g, "\n").trimEnd();
  const lines = normalized.split("\n");
  const monthLabel = lines[0]?.trim();
  const title = lines[1]?.trim();

  if (!monthLabel) throw new Error("public/content/program/program.txt: prvý riadok musí obsahovať názov mesiaca.");
  if (!title) throw new Error("public/content/program/program.txt: druhý riadok musí obsahovať názov programu.");

  const eventLines = lines
    .slice(2)
    .map((line, index) => ({ line: line.trim(), lineNumber: index + 3 }))
    .filter(({ line }) => Boolean(line));
  if (!eventLines.length) throw new Error("public/content/program/program.txt musí obsahovať aspoň jednu udalosť.");

  const events = eventLines.map(({ line, lineNumber }) => {
    const parts = line.split("|").map((part) => part.trim());
    if ((parts.length !== 4 && parts.length !== 5) || parts.slice(0, 4).some((part) => !part)) {
      throw new Error(
        `public/content/program/program.txt riadok ${lineNumber}: použite formát "dátum | čas | názov | popis" alebo "dátum | čas | názov | popis | obrázok pozvánky".`,
      );
    }

    const [date, time, eventTitle, description, invitationImage] = parts;
    if (!/^\d{1,2}\.\d{1,2}\.$/.test(date)) {
      throw new Error(`public/content/program/program.txt riadok ${lineNumber}: dátum musí byť napr. "6.9.".`);
    }
    if (!/^\d{1,2}:\d{2}$/.test(time)) {
      throw new Error(`public/content/program/program.txt riadok ${lineNumber}: čas musí byť napr. "9:30".`);
    }

    return {
      date,
      time,
      title: eventTitle,
      description,
      ...(invitationImage ? { invitationImage } : {}),
    };
  });

  return {
    monthLabel,
    title,
    poster: "/content/program/current-program.jpg",
    posterAlt: `${title} – ${monthLabel}`,
    events,
  };
}

function assertValidIsoDate(date, context) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`${context}: dátum musí byť vo formáte YYYY-MM-DD.`);
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.valueOf()) || parsed.toISOString().slice(0, 10) !== date) {
    throw new Error(`${context}: neplatný dátum "${date}".`);
  }
}

function validateCategories(categories) {
  if (!Array.isArray(categories)) throw new Error("src/content/galleryCategories.json musí obsahovať pole kategórií.");

  const ids = categories.map((category) => category.id);
  const sortedIds = [...ids].sort();
  const sortedAllowed = [...allowedCategoryIds].sort();
  if (JSON.stringify(sortedIds) !== JSON.stringify(sortedAllowed)) {
    throw new Error(`Kurátorské galérie musia používať presne tieto ID: ${allowedCategoryIds.join(", ")}.`);
  }

  for (const category of categories) {
    if (!category.id || !category.folder || !category.title || !category.category || !category.description) {
      throw new Error("src/content/galleryCategories.json musí obsahovať id, category, title, description a folder pre každú galériu.");
    }
    if (category.id !== category.folder) {
      throw new Error(`Kategória ${category.id}: folder musí byť rovnaký ako id, aby bol systém jednoduchý na údržbu.`);
    }
  }
}

async function validateNoObsoleteFolders() {
  for (const folder of obsoleteCategoryIds) {
    const folderPath = path.join(galleryDirectory, folder);
    if (await exists(folderPath)) {
      throw new Error(`Zastaraný priečinok galérie ešte existuje: public/content/gallery/${folder}. Presuňte fotky do novej 4-kategóriovej štruktúry a priečinok odstráňte.`);
    }
  }
}

function normalizeBaseUrl(baseUrl) {
  return baseUrl.replace(/\/+$/, "");
}

async function readJson(filePath, fallback = null) {
  if (!(await exists(filePath))) return fallback;
  return JSON.parse(await readFile(filePath, "utf8"));
}

async function validateSundayArchive() {
  const mediaConfig = await readJson(mediaConfigPath, { publicMediaBaseUrl: "https://media.gmcsered.sk" });
  const publicMediaBaseUrl = normalizeBaseUrl(process.env.R2_PUBLIC_BASE_URL || mediaConfig.publicMediaBaseUrl || "");
  if (!publicMediaBaseUrl) throw new Error("src/content/mediaConfig.json musí obsahovať publicMediaBaseUrl.");

  const archive = await readJson(sundaysPath, { sundays: [] });
  if (!archive || !Array.isArray(archive.sundays)) throw new Error("src/content/sundays.json musí obsahovať objekt { \"sundays\": [...] }.");

  const seen = new Set();
  let previousDate = null;

  for (const sunday of archive.sundays) {
    if (!sunday || typeof sunday !== "object") throw new Error("Každá nedeľná galéria musí byť objekt.");
    assertValidIsoDate(sunday.date, `Nedeľná galéria ${sunday.date || "(bez dátumu)"}`);
    if (seen.has(sunday.date)) throw new Error(`Duplicitná nedeľná galéria: ${sunday.date}.`);
    seen.add(sunday.date);

    if (previousDate && sunday.date > previousDate) throw new Error("src/content/sundays.json musí byť zoradený od najnovšej nedele po najstaršiu.");
    previousDate = sunday.date;

    if (!sunday.title || !sunday.cover || typeof sunday.photoCount !== "number" || !sunday.manifest) {
      throw new Error(`Nedeľa ${sunday.date}: chýba title, cover, photoCount alebo manifest.`);
    }
    if (!Number.isInteger(sunday.photoCount) || sunday.photoCount < 1) {
      throw new Error(`Nedeľa ${sunday.date}: photoCount musí byť kladné celé číslo.`);
    }
    if (!sunday.cover.startsWith(`${publicMediaBaseUrl}/`)) {
      throw new Error(`Nedeľa ${sunday.date}: cover musí začínať public media URL ${publicMediaBaseUrl}.`);
    }
    if (!sunday.manifest.startsWith("/content/sundays/") || !sunday.manifest.endsWith(".json")) {
      throw new Error(`Nedeľa ${sunday.date}: manifest musí smerovať do /content/sundays/YYYY-MM-DD.json.`);
    }

    const manifestFile = path.join(publicDirectory, sunday.manifest.replace(/^\//, ""));
    if (!(await exists(manifestFile))) throw new Error(`Nedeľa ${sunday.date}: chýba manifest ${sunday.manifest}.`);
    const manifest = await readJson(manifestFile);

    if (!manifest || manifest.date !== sunday.date || !Array.isArray(manifest.photos)) {
      throw new Error(`Nedeľa ${sunday.date}: manifest má neplatný formát.`);
    }
    if (manifest.photos.length !== sunday.photoCount) {
      throw new Error(`Nedeľa ${sunday.date}: photoCount (${sunday.photoCount}) nesedí s počtom fotiek v manifeste (${manifest.photos.length}).`);
    }
    if (!manifest.photos.length) throw new Error(`Nedeľa ${sunday.date}: manifest nesmie byť prázdny.`);

    const thumbnailUrls = new Set();
    for (const [index, photo] of manifest.photos.entries()) {
      const context = `Nedeľa ${sunday.date}, fotografia ${index + 1}`;
      if (!photo.thumbnail || !photo.full) throw new Error(`${context}: chýba thumbnail alebo full URL.`);
      if (!photo.thumbnail.startsWith(`${publicMediaBaseUrl}/`) || !photo.full.startsWith(`${publicMediaBaseUrl}/`)) {
        throw new Error(`${context}: URL musí začínať ${publicMediaBaseUrl}.`);
      }
      thumbnailUrls.add(photo.thumbnail);
    }
    if (!thumbnailUrls.has(sunday.cover)) throw new Error(`Nedeľa ${sunday.date}: cover musí byť jedna z thumbnail fotiek.`);
  }
}

async function main() {
  const program = parseProgramText(await readFile(programTextPath, "utf8"));
  const posterPath = path.join(publicDirectory, program.poster.replace(/^\//, ""));
  if (!(await exists(posterPath))) throw new Error(`Programový plagát neexistuje: ${program.poster}`);

  const categories = JSON.parse(await readFile(categoriesPath, "utf8"));
  validateCategories(categories);
  await validateNoObsoleteFolders();
  await validateSundayArchive();

  const manifest = {};
  for (const category of categories) {
    const categoryDirectory = path.join(galleryDirectory, category.folder);
    if (!(await exists(categoryDirectory))) throw new Error(`Chýba priečinok galérie: public/content/gallery/${category.folder}`);
    if (!(await stat(categoryDirectory)).isDirectory()) throw new Error(`Galéria nie je priečinok: public/content/gallery/${category.folder}`);

    const photos = await collectImages(categoryDirectory);
    if (!photos.length) throw new Error(`Galéria public/content/gallery/${category.folder} neobsahuje žiadne fotky.`);
    manifest[category.folder] = photos.map((photo) => `/content/gallery/${category.folder}/${photo}`);
  }

  const galleryOutput = stableJson(manifest);
  const programOutput = stableJson(program);
  for (const warning of warnings) console.warn(`⚠ ${warning}`);

  if (isCheck) {
    if (warnings.length) throw new Error("Galérie obsahujú nepodporované súbory.");
    if (!(await exists(manifestPath))) throw new Error("Chýba src/generated/gallery-manifest.json. Spustite npm run content:generate.");
    if ((await readFile(manifestPath, "utf8")) !== galleryOutput) throw new Error("Manifest galérie nie je aktuálny. Spustite npm run content:generate.");
    if (!(await exists(programPath))) throw new Error("Chýba src/content/program.json. Spustite npm run content:generate.");
    if ((await readFile(programPath, "utf8")) !== programOutput) throw new Error("Program JSON nie je aktuálny. Spustite npm run content:generate.");
    console.log("Obsah GMC je v poriadku.");
    return;
  }

  await mkdir(path.dirname(manifestPath), { recursive: true });
  await mkdir(path.dirname(programPath), { recursive: true });
  await mkdir(sundayManifestDirectory, { recursive: true });
  await writeFile(manifestPath, galleryOutput);
  await writeFile(programPath, programOutput);
  console.log(`Vytvorený program a manifest galérie pre ${categories.length} kategórií.`);
}

main().catch((error) => {
  console.error(`Chyba kontroly obsahu: ${error.message}`);
  process.exitCode = 1;
});
