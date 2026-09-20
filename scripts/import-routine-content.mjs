import { createHash } from "node:crypto";
import { access, mkdir, readFile, readdir, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { isProgramMonthId, programMonthLabel, programMonthName } from "./program-months.mjs";

const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentDirectory = path.join(rootDirectory, "content");
const invitationsDirectory = path.join(contentDirectory, "invitations");
const programDirectory = path.join(contentDirectory, "program");
const specialEventsDirectory = path.join(contentDirectory, "special-events");
const publicDirectory = path.join(rootDirectory, "public");
const publicInvitationsDirectory = path.join(publicDirectory, "content", "invitations");
const publicProgramDirectory = path.join(publicDirectory, "content", "program");
const cachePath = path.join(rootDirectory, ".content-cache", "routine-content.json");
const supportedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"]);

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
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

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function publicPath(filePath) {
  return `/${path.relative(publicDirectory, filePath).split(path.sep).join("/")}`;
}

function titleFromFilename(value) {
  const title = value.replace(/-/g, " ").replace(/\s+/g, " ").trim();
  if (!title) throw new Error("Názov udalosti vo filename nesmie byť prázdny.");
  return title.charAt(0).toLocaleUpperCase("sk") + title.slice(1);
}

function assertIsoDate(value, context) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error(`${context}: dátum musí mať formát YYYY-MM-DD.`);
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.valueOf()) || parsed.toISOString().slice(0, 10) !== value) {
    throw new Error(`${context}: neplatný dátum "${value}".`);
  }
}

function formatProgramDate(isoDate) {
  const [, month, day] = isoDate.split("-").map(Number);
  return `${day}.${month}.`;
}

function normalizeProgramTime(value) {
  const match = /^(\d{1,2}):(\d{2})$/.exec(String(value).trim());
  if (!match) return String(value).trim();
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return String(value).trim();
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function parseInvitationFilename(filename) {
  const baseName = path.basename(filename, path.extname(filename));
  const parts = baseName.split("--");
  if (parts.length !== 3) {
    throw new Error(`Pozvánka "${filename}" musí mať názov YYYY-MM-DD--HHMM--Názov-udalosti.ext.`);
  }

  const [date, compactTime, titlePart] = parts;
  assertIsoDate(date, `Pozvánka "${filename}"`);
  if (!/^\d{4}$/.test(compactTime)) {
    throw new Error(`Pozvánka "${filename}": čas musí mať formát HHMM, napr. 0930.`);
  }

  const hours = Number(compactTime.slice(0, 2));
  const minutes = Number(compactTime.slice(2));
  if (hours > 23 || minutes > 59) throw new Error(`Pozvánka "${filename}": čas "${compactTime}" nie je platný.`);

  const title = titleFromFilename(titlePart);
  return {
    date,
    month: date.slice(0, 7),
    time: `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`,
    title,
    slug: slugify(title),
  };
}

function parseSpecialEventFilename(filename) {
  const baseName = path.basename(filename, path.extname(filename));
  const parts = baseName.split("--");
  if (parts.length !== 2) {
    throw new Error(`Špeciálna udalosť "${filename}" musí mať názov YYYY-MM-DD--Názov-udalosti.ext.`);
  }

  const [date, titlePart] = parts;
  assertIsoDate(date, `Špeciálna udalosť "${filename}"`);
  const title = titleFromFilename(titlePart);
  return { date, title, slug: slugify(title) };
}

function parseProgramFilename(filename) {
  const month = path.basename(filename, path.extname(filename));
  if (!isProgramMonthId(month)) {
    throw new Error(`Mesačný plagát "${filename}" musí mať názov YYYY-MM.ext, napr. 2026-10.jpg.`);
  }
  return month;
}

async function listImageFiles(directory, label, { allowJson = false } = {}) {
  if (!(await exists(directory))) return [];
  const entries = await readdir(directory, { withFileTypes: true });
  const unsupported = [];
  const files = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".") || !entry.isFile()) continue;
    const extension = path.extname(entry.name).toLowerCase();
    if (supportedExtensions.has(extension)) {
      files.push(entry.name);
    } else if (!(allowJson && extension === ".json")) {
      unsupported.push(entry.name);
    }
  }

  if (unsupported.length) {
    throw new Error(`${label} obsahuje nepodporované súbory: ${unsupported.join(", ")}. Podporované sú JPG, JPEG, PNG, WebP, HEIC a HEIF.`);
  }

  return files.sort((left, right) => left.localeCompare(right, "sk", { numeric: true, sensitivity: "base" }));
}

async function sourceSignature(filePath) {
  return createHash("sha256").update(await readFile(filePath)).digest("hex");
}

async function optimiseImage(sourcePath, outputPath, maxLongEdge, sourceName) {
  try {
    await mkdir(path.dirname(outputPath), { recursive: true });
    const temporaryPath = path.join(path.dirname(outputPath), `.${path.basename(outputPath)}.tmp.webp`);
    const info = await sharp(sourcePath, { failOn: "warning" })
      .rotate()
      .resize({ width: maxLongEdge, height: maxLongEdge, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 88 })
      .toFile(temporaryPath);
    await rename(temporaryPath, outputPath);
    return { width: info.width, height: info.height };
  } catch (error) {
    const extension = path.extname(sourceName).toLowerCase();
    if (extension === ".heic" || extension === ".heif") {
      throw new Error(`HEIC/HEIF súbor "${sourceName}" sa na tomto Macu nepodarilo spracovať. Exportujte ho ako JPG a spustite skript znova.`);
    }
    throw new Error(`Obrázok "${sourceName}" sa nepodarilo spracovať: ${error.message}`);
  }
}

async function importImage({ cache, cacheKey, sourcePath, sourceName, outputPath, maxLongEdge }) {
  const signature = await sourceSignature(sourcePath);
  const previous = cache.assets[cacheKey];
  if (previous?.signature === signature && (await exists(outputPath))) {
    return { ...previous, processed: false, src: publicPath(outputPath) };
  }

  const dimensions = await optimiseImage(sourcePath, outputPath, maxLongEdge, sourceName);
  const asset = { signature, ...dimensions };
  cache.assets[cacheKey] = asset;
  return { ...asset, processed: true, src: publicPath(outputPath) };
}

async function loadProgram(month) {
  const programPath = path.join(programDirectory, `${month}.json`);
  const program = await readJson(programPath, null);
  if (!program) {
    return {
      path: programPath,
      data: {
        id: month,
        active: true,
        monthLabel: programMonthLabel(month),
        title: programMonthName(month),
        events: [],
      },
    };
  }

  if (program.id !== month) throw new Error(`content/program/${month}.json: id musí byť ${month}.`);
  if (!Array.isArray(program.events)) throw new Error(`content/program/${month}.json: events musí byť pole.`);
  return { path: programPath, data: program };
}

function sortProgramEvents(events) {
  return [...events].sort((left, right) => {
    const leftDay = Number.parseInt(left.date, 10) || 0;
    const rightDay = Number.parseInt(right.date, 10) || 0;
    return leftDay - rightDay || String(left.time).localeCompare(String(right.time), "sk");
  });
}

async function importProgramPosters(cache) {
  const files = await listImageFiles(programDirectory, "content/program", { allowJson: true });
  const months = new Set();
  let imported = 0;

  for (const filename of files) {
    const month = parseProgramFilename(filename);
    if (months.has(month)) throw new Error(`Pre ${month} je v content/program viac než jeden plagát. Nechajte tam iba jeden súbor ${month}.ext.`);
    months.add(month);
    const sourcePath = path.join(programDirectory, filename);
    const outputPath = path.join(publicProgramDirectory, month, `${month}-program.webp`);
    const asset = await importImage({
      cache,
      cacheKey: `program/${filename}`,
      sourcePath,
      sourceName: filename,
      outputPath,
      maxLongEdge: 2400,
    });
    const program = await loadProgram(month);
    const nextData = {
      ...program.data,
      poster: asset.src,
      posterAlt: `Mesačný plagát: ${programMonthLabel(month)}`,
      posterWidth: asset.width,
      posterHeight: asset.height,
    };

    await writeJsonAtomic(program.path, nextData);
    if (asset.processed) imported += 1;
  }

  return { files: files.length, imported };
}

async function importInvitations(cache) {
  const files = await listImageFiles(invitationsDirectory, "content/invitations");
  const eventKeys = new Set();
  let imported = 0;

  for (const filename of files) {
    const invitation = parseInvitationFilename(filename);
    const eventKey = `${invitation.date}/${invitation.time}`;
    if (eventKeys.has(eventKey)) throw new Error(`Pre ${invitation.date} o ${invitation.time} je v content/invitations viac než jedna pozvánka.`);
    eventKeys.add(eventKey);
    const sourcePath = path.join(invitationsDirectory, filename);
    const outputPath = path.join(
      publicInvitationsDirectory,
      "program",
      invitation.month,
      `${invitation.date}-${invitation.time.replace(":", "")}-${invitation.slug}.webp`,
    );
    const asset = await importImage({
      cache,
      cacheKey: `invitations/${filename}`,
      sourcePath,
      sourceName: filename,
      outputPath,
      maxLongEdge: 2200,
    });
    const program = await loadProgram(invitation.month);
    const matchingEvent = program.data.events.find(
      (event) => event.date === formatProgramDate(invitation.date) && normalizeProgramTime(event.time) === invitation.time,
    );
    const invitationData = {
      invitationImage: asset.src,
      invitationAlt: `Pozvánka: ${matchingEvent?.title ?? invitation.title}, ${formatProgramDate(invitation.date)}`,
      invitationWidth: asset.width,
      invitationHeight: asset.height,
    };

    if (matchingEvent) {
      Object.assign(matchingEvent, invitationData);
    } else {
      program.data.events.push({
        id: `${invitation.month}-${slugify(`${invitation.date}-${invitation.time}-${invitation.title}`)}`,
        date: formatProgramDate(invitation.date),
        time: invitation.time,
        title: invitation.title,
        description: "",
        published: true,
        ...invitationData,
      });
      program.data.events = sortProgramEvents(program.data.events);
    }

    await writeJsonAtomic(program.path, program.data);
    if (asset.processed) imported += 1;
  }

  return { files: files.length, imported };
}

async function importSpecialEvents(cache) {
  const files = await listImageFiles(specialEventsDirectory, "content/special-events", { allowJson: true });
  const eventIds = new Set();
  let imported = 0;

  for (const filename of files) {
    const specialEvent = parseSpecialEventFilename(filename);
    const id = `${specialEvent.date}-${specialEvent.slug}`;
    if (eventIds.has(id)) throw new Error(`Špeciálna udalosť ${id} je v content/special-events viac než raz.`);
    eventIds.add(id);
    const sourcePath = path.join(specialEventsDirectory, filename);
    const outputPath = path.join(publicInvitationsDirectory, "special-events", `${id}.webp`);
    const asset = await importImage({
      cache,
      cacheKey: `special-events/${filename}`,
      sourcePath,
      sourceName: filename,
      outputPath,
      maxLongEdge: 2200,
    });
    const eventPath = path.join(specialEventsDirectory, `${id}.json`);
    const existing = await readJson(eventPath, {});
    await writeJsonAtomic(eventPath, {
      id,
      title: specialEvent.title,
      date: specialEvent.date,
      published: true,
      sortOrder: Number(specialEvent.date.replace(/-/g, "")),
      ...existing,
      invitationImage: asset.src,
      invitationAlt: `Pozvánka: ${existing.title ?? specialEvent.title}`,
      invitationWidth: asset.width,
      invitationHeight: asset.height,
    });
    if (asset.processed) imported += 1;
  }

  return { files: files.length, imported };
}

async function main() {
  const cache = await readJson(cachePath, { version: 1, assets: {} });
  if (!cache.assets || typeof cache.assets !== "object") cache.assets = {};

  const program = await importProgramPosters(cache);
  const invitations = await importInvitations(cache);
  const specialEvents = await importSpecialEvents(cache);
  await writeJsonAtomic(cachePath, cache);

  console.log(`Mesačné plagáty: ${program.files} nájdené, ${program.imported} spracované.`);
  console.log(`Pozvánky: ${invitations.files} nájdené, ${invitations.imported} spracované.`);
  console.log(`Špeciálne udalosti: ${specialEvents.files} nájdené, ${specialEvents.imported} spracované.`);
}

main().catch((error) => {
  console.error(`Chyba importu obsahu: ${error.message}`);
  process.exitCode = 1;
});
