import { access, mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentDirectory = path.join(rootDirectory, "content");
const publicDirectory = path.join(rootDirectory, "public");
const galleryDirectory = path.join(publicDirectory, "content", "gallery");
const sundayManifestDirectory = path.join(publicDirectory, "content", "sundays");
const manifestPath = path.join(rootDirectory, "src", "generated", "gallery-manifest.json");
const categoriesPath = path.join(rootDirectory, "src", "content", "galleryCategories.json");
const programDirectory = path.join(contentDirectory, "program");
const legacyProgramTextPath = path.join(publicDirectory, "content", "program", "program.txt");
const programPath = path.join(rootDirectory, "src", "content", "program.json");
const specialEventsDirectory = path.join(contentDirectory, "special-events");
const specialEventsPath = path.join(rootDirectory, "src", "content", "specialEvents.json");
const sundayGalleryDirectory = path.join(contentDirectory, "sunday-galleries");
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

async function readJson(filePath, fallback = null) {
  if (!(await exists(filePath))) return fallback;
  return JSON.parse(await readFile(filePath, "utf8"));
}

async function listJsonFiles(directory) {
  if (!(await exists(directory))) return [];
  const entries = await readdir(directory, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && !entry.name.startsWith(".") && entry.name.endsWith(".json"))
    .map((entry) => path.join(directory, entry.name))
    .sort((left, right) => path.basename(left).localeCompare(path.basename(right), "sk", { numeric: true }));
}

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
    return {
      id: `${date}-${time}-${eventTitle}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      date,
      time,
      title: eventTitle,
      description,
      ...(invitationImage ? { invitationImage } : {}),
    };
  });

  return {
    id: "legacy-program",
    active: true,
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

function assertProgramDate(date, context) {
  if (!/^\d{1,2}\.\d{1,2}\.$/.test(date)) throw new Error(`${context}: dátum musí byť napr. "6.9.".`);
}

function assertProgramTime(time, context) {
  if (!/^\d{1,2}:\d{2}$/.test(time)) throw new Error(`${context}: čas musí byť napr. "9:30".`);
}

async function assertPublicReference(reference, context) {
  if (!reference) throw new Error(`${context}: chýba cesta k obrázku.`);
  if (/^https?:\/\//.test(reference)) return;
  if (!reference.startsWith("/")) throw new Error(`${context}: cesta musí začínať lomkou alebo byť plná URL.`);
  const localPath = path.join(publicDirectory, reference.replace(/^\//, ""));
  if (!(await exists(localPath))) throw new Error(`${context}: obrázok neexistuje (${reference}).`);
}

function normalizeBaseUrl(baseUrl) {
  return baseUrl.replace(/\/+$/, "");
}

async function loadProgram() {
  const files = await listJsonFiles(programDirectory);
  if (!files.length) return parseProgramText(await readFile(legacyProgramTextPath, "utf8"));

  const programs = await Promise.all(files.map((file) => readJson(file)));
  const activePrograms = programs.filter((program) => program?.active !== false);
  const selected = activePrograms.at(-1) ?? programs.at(-1);
  if (!selected) throw new Error("content/program neobsahuje žiadny program.");
  return selected;
}

async function validateProgram(program) {
  if (!program.id || !program.monthLabel || !program.title || !program.poster || !program.posterAlt) {
    throw new Error("Program musí obsahovať id, monthLabel, title, poster a posterAlt.");
  }
  if (!Array.isArray(program.events) || !program.events.length) throw new Error("Program musí obsahovať aspoň jednu udalosť.");
  await assertPublicReference(program.poster, `Program ${program.id}, plagát`);

  const eventIds = new Set();
  for (const [index, event] of program.events.entries()) {
    const context = `Program ${program.id}, udalosť ${index + 1}`;
    if (!event.id || !event.date || !event.time || !event.title) throw new Error(`${context}: chýba id, date, time alebo title.`);
    if (eventIds.has(event.id)) throw new Error(`${context}: duplicitné id "${event.id}".`);
    eventIds.add(event.id);
    assertProgramDate(event.date, context);
    assertProgramTime(event.time, context);
    if (event.invitationImage) await assertPublicReference(event.invitationImage, `${context}, pozvánka`);
  }
}

function publicProgram(program) {
  return {
    monthLabel: program.monthLabel,
    title: program.title,
    poster: program.poster,
    posterAlt: program.posterAlt,
    events: program.events
      .filter((event) => event.published !== false)
      .map(({ id, date, time, title, description = "", speaker, invitationImage, invitationAlt, invitationWidth, invitationHeight }) => ({
        id,
        date,
        time,
        title,
        description: description || speaker || "",
        ...(speaker ? { speaker } : {}),
        ...(invitationImage ? { invitationImage } : {}),
        ...(invitationAlt ? { invitationAlt } : {}),
        ...(invitationWidth ? { invitationWidth } : {}),
        ...(invitationHeight ? { invitationHeight } : {}),
      })),
  };
}

async function loadSpecialEvents() {
  const files = await listJsonFiles(specialEventsDirectory);
  const events = [];
  for (const file of files) {
    const event = await readJson(file);
    if (!event?.id || !event?.title) throw new Error(`${path.relative(rootDirectory, file)}: špeciálna udalosť musí obsahovať id a title.`);
    if (event.date) assertValidIsoDate(event.date, `Špeciálna udalosť ${event.id}`);
    if (event.invitationImage) await assertPublicReference(event.invitationImage, `Špeciálna udalosť ${event.id}, pozvánka`);
    events.push(event);
  }
  return events.sort((left, right) => (left.sortOrder ?? 999).toString().localeCompare((right.sortOrder ?? 999).toString(), "sk", { numeric: true }));
}

async function loadSundayGalleriesFromContent() {
  const files = await listJsonFiles(sundayGalleryDirectory);
  const galleries = [];

  for (const file of files) {
    const gallery = await readJson(file);
    const relativeName = path.relative(rootDirectory, file);
    if (!gallery?.date || !gallery?.title) throw new Error(`${relativeName}: galéria musí obsahovať date a title.`);
    assertValidIsoDate(gallery.date, `Nedeľná galéria ${gallery.date}`);
    if (!Array.isArray(gallery.photos)) throw new Error(`${relativeName}: photos musí byť pole.`);
    if (gallery.published === false) continue;
    if (!gallery.photos.length) throw new Error(`${relativeName}: publikovaná galéria musí mať aspoň jednu fotografiu.`);

    const sortedPhotos = [...gallery.photos].sort((left, right) => (left.sortOrder ?? 0) - (right.sortOrder ?? 0));
    const photoIds = new Set();
    for (const [index, photo] of sortedPhotos.entries()) {
      const context = `Nedeľa ${gallery.date}, fotografia ${index + 1}`;
      if (!photo.id || !photo.thumbnail || !photo.full) throw new Error(`${context}: chýba id, thumbnail alebo full.`);
      if (photoIds.has(photo.id)) throw new Error(`${context}: duplicitné id "${photo.id}".`);
      photoIds.add(photo.id);
      await assertPublicReference(photo.thumbnail, `${context}, thumbnail`);
      await assertPublicReference(photo.full, `${context}, full`);
    }

    const coverPhoto = sortedPhotos.find((photo) => photo.id === gallery.coverPhotoId) ?? sortedPhotos[0];
    galleries.push({
      date: gallery.date,
      title: gallery.title,
      cover: coverPhoto.thumbnail,
      photoCount: sortedPhotos.length,
      manifest: `/content/sundays/${gallery.date}.json`,
      manifestData: {
        date: gallery.date,
        title: gallery.title,
        photos: sortedPhotos.map(({ thumbnail, full, alt, width, height }) => ({
          thumbnail,
          full,
          ...(alt ? { alt } : {}),
          ...(width ? { width } : {}),
          ...(height ? { height } : {}),
        })),
      },
    });
  }

  return galleries.sort((left, right) => right.date.localeCompare(left.date));
}

async function loadLegacySundayArchive() {
  const mediaConfig = await readJson(mediaConfigPath, { publicMediaBaseUrl: "https://media.gmcsered.sk" });
  const publicMediaBaseUrl = normalizeBaseUrl(process.env.R2_PUBLIC_BASE_URL || mediaConfig.publicMediaBaseUrl || "");
  if (!publicMediaBaseUrl) throw new Error("src/content/mediaConfig.json musí obsahovať publicMediaBaseUrl.");

  const archive = await readJson(sundaysPath, { sundays: [] });
  if (!archive || !Array.isArray(archive.sundays)) throw new Error("src/content/sundays.json musí obsahovať objekt { \"sundays\": [...] }.");

  for (const sunday of archive.sundays) {
    if (!sunday.cover.startsWith(`${publicMediaBaseUrl}/`) && !sunday.cover.startsWith("/")) {
      throw new Error(`Nedeľa ${sunday.date}: cover musí byť lokálna cesta alebo public media URL ${publicMediaBaseUrl}.`);
    }
  }

  return archive.sundays.map((sunday) => ({ ...sunday, manifestData: null }));
}

async function loadSundayArchive() {
  const contentGalleries = await loadSundayGalleriesFromContent();
  if (contentGalleries.length) return contentGalleries;
  return loadLegacySundayArchive();
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

async function main() {
  const program = await loadProgram();
  await validateProgram(program);
  const publicProgramData = publicProgram(program);
  const specialEvents = await loadSpecialEvents();
  const sundayArchive = await loadSundayArchive();

  let previousDate = null;
  const sundayDates = new Set();
  for (const sunday of sundayArchive) {
    assertValidIsoDate(sunday.date, `Nedeľná galéria ${sunday.date || "(bez dátumu)"}`);
    if (sundayDates.has(sunday.date)) throw new Error(`Duplicitná nedeľná galéria: ${sunday.date}.`);
    sundayDates.add(sunday.date);
    if (previousDate && sunday.date > previousDate) throw new Error("Nedeľné galérie musia byť zoradené od najnovšej po najstaršiu.");
    previousDate = sunday.date;
  }

  const categories = JSON.parse(await readFile(categoriesPath, "utf8"));
  validateCategories(categories);
  await validateNoObsoleteFolders();

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
  const programOutput = stableJson(publicProgramData);
  const specialEventsOutput = stableJson({ events: specialEvents });
  const sundaysOutput = stableJson({
    sundays: sundayArchive.map(({ manifestData: _manifestData, ...sunday }) => sunday),
  });
  for (const warning of warnings) console.warn(`⚠ ${warning}`);

  if (isCheck) {
    if (warnings.length) throw new Error("Galérie obsahujú nepodporované súbory.");
    if (!(await exists(manifestPath))) throw new Error("Chýba src/generated/gallery-manifest.json. Spustite npm run content:generate.");
    if ((await readFile(manifestPath, "utf8")) !== galleryOutput) throw new Error("Manifest galérie nie je aktuálny. Spustite npm run content:generate.");
    if (!(await exists(programPath))) throw new Error("Chýba src/content/program.json. Spustite npm run content:generate.");
    if ((await readFile(programPath, "utf8")) !== programOutput) throw new Error("Program JSON nie je aktuálny. Spustite npm run content:generate.");
    if (!(await exists(specialEventsPath))) throw new Error("Chýba src/content/specialEvents.json. Spustite npm run content:generate.");
    if ((await readFile(specialEventsPath, "utf8")) !== specialEventsOutput) throw new Error("Špeciálne udalosti nie sú aktuálne. Spustite npm run content:generate.");
    if ((await readFile(sundaysPath, "utf8")) !== sundaysOutput) throw new Error("Nedeľný fotoarchív nie je aktuálny. Spustite npm run content:generate.");
    console.log("Obsah GMC je v poriadku.");
    return;
  }

  await mkdir(path.dirname(manifestPath), { recursive: true });
  await mkdir(path.dirname(programPath), { recursive: true });
  await mkdir(sundayManifestDirectory, { recursive: true });
  await writeFile(manifestPath, galleryOutput);
  await writeFile(programPath, programOutput);
  await writeFile(specialEventsPath, specialEventsOutput);
  await writeFile(sundaysPath, sundaysOutput);

  for (const sunday of sundayArchive) {
    if (!sunday.manifestData) continue;
    await writeFile(path.join(sundayManifestDirectory, `${sunday.date}.json`), stableJson(sunday.manifestData));
  }

  console.log(`Vytvorený program, špeciálne udalosti, nedeľný archív a manifest galérie pre ${categories.length} kategórií.`);
}

main().catch((error) => {
  console.error(`Chyba kontroly obsahu: ${error.message}`);
  process.exitCode = 1;
});
