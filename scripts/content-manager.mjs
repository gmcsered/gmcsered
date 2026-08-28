import { spawn, spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { access, copyFile, mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import readline from "node:readline/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentDirectory = path.join(rootDirectory, "content");
const programDirectory = path.join(contentDirectory, "program");
const specialEventsDirectory = path.join(contentDirectory, "special-events");
const sundayGalleryDirectory = path.join(contentDirectory, "sunday-galleries");
const publicDirectory = path.join(rootDirectory, "public");
const publicInvitationDirectory = path.join(publicDirectory, "content", "invitations");
const publicProgramDirectory = path.join(publicDirectory, "content", "program");
const publicSundayDirectory = path.join(publicDirectory, "content", "sundays");
const supportedInputExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"]);
const allowedPublishPrefixes = [
  "content/",
  "public/content/",
  "src/content/program.json",
  "src/content/specialEvents.json",
  "src/content/sundays.json",
  "src/generated/gallery-manifest.json",
];
const slovakMonthNames = [
  "Január",
  "Február",
  "Marec",
  "Apríl",
  "Máj",
  "Jún",
  "Júl",
  "August",
  "September",
  "Október",
  "November",
  "December",
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const stableJson = (value) => `${JSON.stringify(value, null, 2)}\n`;

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
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

function normalizeInputPath(value) {
  const trimmed = value.trim().replace(/^['"]|['"]$/g, "");
  return trimmed.replace(/\\(.)/g, "$1");
}

function resolveUserPath(value) {
  return path.resolve(rootDirectory, normalizeInputPath(value));
}

function formatMonthLabel(id) {
  const [, month] = id.split("-").map(Number);
  const monthName = slovakMonthNames[month - 1] ?? id.slice(5);
  return `${monthName} ${id.slice(0, 4)} v GMC Sereď`;
}

function defaultProgramTitle(id) {
  const [, month] = id.split("-").map(Number);
  return slovakMonthNames[month - 1] ?? "Mesačný program";
}

function assertProgramDate(date) {
  if (!/^\d{1,2}\.\d{1,2}\.$/.test(date)) throw new Error("Dátum programu musí byť napríklad 6.9.");
}

function assertTime(time) {
  if (!/^\d{1,2}:\d{2}$/.test(time)) throw new Error("Čas musí byť napríklad 9:30.");
}

function assertIsoDate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("Dátum musí byť vo formáte YYYY-MM-DD.");
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.valueOf()) || parsed.toISOString().slice(0, 10) !== date) throw new Error("Dátum nie je platný.");
}

async function readJson(filePath, fallback = null) {
  if (!(await exists(filePath))) return fallback;
  return JSON.parse(await readFile(filePath, "utf8"));
}

async function writeJson(filePath, value) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, stableJson(value));
}

async function prompt(message, defaultValue = "") {
  const suffix = defaultValue ? ` (${defaultValue})` : "";
  const answer = await rl.question(`${message}${suffix}: `);
  return answer.trim() || defaultValue;
}

async function confirm(message, defaultValue = false) {
  const answer = (await prompt(`${message} ${defaultValue ? "[Á/n]" : "[á/N]"}`)).toLowerCase();
  if (!answer) return defaultValue;
  return ["a", "á", "ano", "áno", "y", "yes"].includes(answer);
}

async function choose(message, options) {
  console.log(`\n${message}`);
  options.forEach((option, index) => console.log(`${index + 1}. ${option.label}`));
  const answer = Number(await prompt("Vyberte číslo"));
  if (!Number.isInteger(answer) || answer < 1 || answer > options.length) {
    console.log("Neplatná voľba.");
    return null;
  }
  return options[answer - 1];
}

async function listJsonFiles(directory) {
  if (!(await exists(directory))) return [];
  const entries = await readdir(directory, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && !entry.name.startsWith(".") && entry.name.endsWith(".json"))
    .map((entry) => path.join(directory, entry.name))
    .sort((left, right) => path.basename(left).localeCompare(path.basename(right), "sk", { numeric: true }));
}

async function loadProgramFiles() {
  return Promise.all(
    (await listJsonFiles(programDirectory)).map(async (file) => ({
      file,
      data: await readJson(file),
    })),
  );
}

function publicPathFromFile(filePath) {
  return `/${path.relative(publicDirectory, filePath).split(path.sep).join("/")}`;
}

async function optimizeImage(inputPath, outputPath, options) {
  const pipeline = sharp(inputPath, { failOn: "warning" }).rotate();
  const info = await pipeline
    .resize({ width: options.maxLongEdge, height: options.maxLongEdge, fit: "inside", withoutEnlargement: true })
    .webp({ quality: options.quality })
    .toFile(outputPath);
  return { width: info.width, height: info.height };
}

async function saveWebImage(inputPath, targetDirectory, baseName, options) {
  const absoluteInput = resolveUserPath(inputPath);
  if (!(await exists(absoluteInput))) throw new Error(`Obrázok neexistuje: ${absoluteInput}`);

  const extension = path.extname(absoluteInput).toLowerCase();
  if (!supportedInputExtensions.has(extension)) throw new Error("Podporované obrázky sú JPG, PNG, WebP, HEIC a HEIF.");

  await mkdir(targetDirectory, { recursive: true });
  const outputPath = path.join(targetDirectory, `${slugify(baseName)}-${Date.now()}.webp`);

  try {
    const dimensions = await optimizeImage(absoluteInput, outputPath, options);
    return { src: publicPathFromFile(outputPath), ...dimensions };
  } catch (error) {
    if (extension === ".heic" || extension === ".heif") {
      throw new Error("HEIC/HEIF sa v tejto lokálnej inštalácii nepodarilo spracovať cez sharp. Exportujte túto jednu pozvánku ako JPG a skúste znova.");
    }
    throw error;
  }
}

async function saveInvitationImage(inputPath, targetKind, baseName) {
  return saveWebImage(inputPath, path.join(publicInvitationDirectory, targetKind), baseName, { maxLongEdge: 2200, quality: 90 });
}

async function saveMonthlyPosterImage(inputPath, program) {
  return saveWebImage(inputPath, path.join(publicProgramDirectory, program.id), `${program.id}-mesacny-plagat`, { maxLongEdge: 2400, quality: 90 });
}

async function chooseProgram() {
  const programs = await loadProgramFiles();
  const options = programs.map(({ data, file }) => ({
    label: `${data.monthLabel || path.basename(file, ".json")} ${data.active === false ? "(skryté)" : ""}`,
    value: { data, file },
  }));
  options.push({ label: "Vytvoriť nový mesiac", value: "new" });
  const selected = await choose("Vyberte programový mesiac", options);
  if (!selected) return null;
  if (selected.value !== "new") return selected.value;

  const id = await prompt("ID mesiaca vo formáte YYYY-MM, napr. 2026-09");
  if (!/^\d{4}-\d{2}$/.test(id)) throw new Error("ID mesiaca musí byť vo formáte YYYY-MM.");
  const title = await prompt("Názov programu", defaultProgramTitle(id));
  const monthLabel = formatMonthLabel(id);
  const file = path.join(programDirectory, `${id}.json`);
  const data = {
    id,
    active: true,
    monthLabel,
    title,
    events: [],
  };
  await writeJson(file, data);
  return { data, file };
}

async function editEvent(program, event = null) {
  const isNew = !event;
  const draft = event ? { ...event } : { id: "", date: "", time: "9:30", title: "", description: "", published: true };
  draft.date = await prompt("Dátum (napr. 6.9.)", draft.date);
  assertProgramDate(draft.date);
  draft.time = await prompt("Čas", draft.time);
  assertTime(draft.time);
  draft.title = await prompt("Názov", draft.title);
  if (!draft.title) throw new Error("Názov je povinný.");
  draft.description = await prompt("Popis", draft.description ?? "");
  draft.speaker = await prompt("Kazateľ/rečník (voliteľné)", draft.speaker ?? "");
  if (!draft.speaker) delete draft.speaker;
  draft.published = await confirm("Má byť udalosť zverejnená?", draft.published !== false);
  if (!draft.id) draft.id = `${program.id}-${slugify(`${draft.date}-${draft.title}`)}`;
  if (isNew) program.events.push(draft);
  else Object.assign(event, draft);
}

async function manageProgramInvitations(program) {
  if (!program.events.length) {
    console.log("Tento mesiac zatiaľ nemá žiadne udalosti.");
    return;
  }
  const selected = await choose(
    "Vyberte udalosť",
    program.events.map((event) => ({ label: `${event.date} ${event.time} – ${event.title}`, value: event })),
  );
  if (!selected) return;
  const event = selected.value;
  console.log(event.invitationImage ? `Aktuálna pozvánka: ${event.invitationImage}` : "Táto udalosť zatiaľ nemá pozvánku.");
  const action = await choose("Čo chcete urobiť?", [
    { label: "Pridať alebo vymeniť pozvánku", value: "replace" },
    { label: "Odstrániť pozvánku", value: "remove" },
    { label: "Späť", value: "back" },
  ]);
  if (!action || action.value === "back") return;
  if (action.value === "remove") {
    delete event.invitationImage;
    delete event.invitationAlt;
    delete event.invitationWidth;
    delete event.invitationHeight;
    return;
  }
  const inputPath = await prompt("Cesta k obrázku pozvánky");
  const saved = await saveInvitationImage(inputPath, `program/${program.id}`, event.id);
  event.invitationImage = saved.src;
  event.invitationWidth = saved.width;
  event.invitationHeight = saved.height;
  event.invitationAlt = `Pozvánka: ${event.title}, ${event.date}`;
}

async function manageMonthlyPoster(program) {
  console.log(program.poster ? `Aktuálny mesačný plagát: ${program.poster}` : "Tento mesiac zatiaľ nemá mesačný plagát.");
  const action = await choose("Mesačný plagát", [
    { label: "Pridať alebo vymeniť plagát", value: "replace" },
    { label: "Odstrániť plagát", value: "remove" },
    { label: "Späť", value: "back" },
  ]);
  if (!action || action.value === "back") return;
  if (action.value === "remove") {
    delete program.poster;
    delete program.posterAlt;
    delete program.posterWidth;
    delete program.posterHeight;
    return;
  }

  const inputPath = await prompt("Cesta k obrázku mesačného plagátu");
  const saved = await saveMonthlyPosterImage(inputPath, program);
  program.poster = saved.src;
  program.posterWidth = saved.width;
  program.posterHeight = saved.height;
  program.posterAlt = `Mesačný plagát: ${program.title || "Program"} – ${program.monthLabel || formatMonthLabel(program.id)}`;
}

function normalizeProgramForWrite(program) {
  if (!program.monthLabel && program.id) program.monthLabel = formatMonthLabel(program.id);
  delete program.description;
  return program;
}

async function programMenu() {
  const selectedProgram = await chooseProgram();
  if (!selectedProgram) return;
  const { data: program, file } = selectedProgram;
  let done = false;
  while (!done) {
    const action = await choose(`Program: ${program.monthLabel}`, [
      { label: "Zobraziť udalosti", value: "list" },
      { label: "Pridať udalosť", value: "add" },
      { label: "Upraviť udalosť", value: "edit" },
      { label: "Vymazať udalosť", value: "delete" },
      { label: "Pozvánka k udalosti", value: "invitation" },
      { label: "Mesačný plagát", value: "poster" },
      { label: "Uložiť a späť", value: "save" },
    ]);
    if (!action) continue;
    if (action.value === "list") {
      console.log("");
      program.events.forEach((event, index) => console.log(`${index + 1}. ${event.date} ${event.time} – ${event.title}${event.invitationImage ? " · pozvánka" : ""}`));
    }
    if (action.value === "add") await editEvent(program);
    if (action.value === "edit") {
      const selected = await choose(
        "Vyberte udalosť",
        program.events.map((event) => ({ label: `${event.date} ${event.time} – ${event.title}`, value: event })),
      );
      if (selected) await editEvent(program, selected.value);
    }
    if (action.value === "delete") {
      const selected = await choose(
        "Vyberte udalosť na vymazanie",
        program.events.map((event, index) => ({ label: `${event.date} ${event.time} – ${event.title}`, value: index })),
      );
      if (selected && (await confirm("Naozaj chcete odstrániť túto udalosť?"))) program.events.splice(selected.value, 1);
    }
    if (action.value === "invitation") await manageProgramInvitations(program);
    if (action.value === "poster") await manageMonthlyPoster(program);
    if (action.value === "save") done = true;
  }
  await writeJson(file, normalizeProgramForWrite(program));
  runCommand("npm", ["run", "content:generate"]);
}

async function listSourceImages(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = entries.filter((entry) => entry.isFile() && !entry.name.startsWith(".")).map((entry) => entry.name);
  const unsupported = files.filter((name) => !supportedInputExtensions.has(path.extname(name).toLowerCase()));
  if (unsupported.length) {
    throw new Error(`Priečinok obsahuje nepodporované súbory: ${unsupported.join(", ")}. Podporované sú JPG, PNG, WebP, HEIC a HEIF.`);
  }
  return files.sort((left, right) => left.localeCompare(right, "sk", { numeric: true, sensitivity: "base" }));
}

async function addSundayGallery() {
  const date = await prompt("Dátum nedele vo formáte YYYY-MM-DD");
  assertIsoDate(date);
  const title = await prompt("Názov galérie", formatSundayTitle(date));
  const sourceFolder = resolveUserPath(await prompt("Cesta k priečinku s fotografiami"));
  if (!(await exists(sourceFolder)) || !(await stat(sourceFolder)).isDirectory()) throw new Error("Zadaná cesta nie je priečinok.");

  const images = await listSourceImages(sourceFolder);
  if (!images.length) throw new Error("Priečinok neobsahuje podporované obrázky.");
  console.log(`Našiel som ${images.length} fotografií.`);
  const coverAnswer = await prompt("Číslo titulnej fotky", "1");
  const coverIndex = Math.max(0, Math.min(images.length - 1, Number(coverAnswer) - 1 || 0));

  const outputDirectory = path.join(publicSundayDirectory, date);
  const thumbDirectory = path.join(outputDirectory, "thumbs");
  await mkdir(thumbDirectory, { recursive: true });

  const photos = [];
  const padLength = Math.max(3, String(images.length).length);
  for (const [index, image] of images.entries()) {
    const sourcePath = path.join(sourceFolder, image);
    const id = `photo-${String(index + 1).padStart(padLength, "0")}`;
    const fullPath = path.join(outputDirectory, `${id}.webp`);
    const thumbPath = path.join(thumbDirectory, `${id}.webp`);
    process.stdout.write(`Spracovávam ${index + 1} z ${images.length}: ${image} ... `);
    try {
      const full = await optimizeImage(sourcePath, fullPath, { maxLongEdge: 2200, quality: 83 });
      await optimizeImage(sourcePath, thumbPath, { maxLongEdge: 700, quality: 80 });
      photos.push({
        id,
        full: publicPathFromFile(fullPath),
        thumbnail: publicPathFromFile(thumbPath),
        width: full.width,
        height: full.height,
        alt: `Fotografia z GMC Sereď, ${title}, ${index + 1}`,
        sortOrder: index + 1,
      });
      console.log("hotovo");
    } catch (error) {
      const extension = path.extname(image).toLowerCase();
      if (extension === ".heic" || extension === ".heif") {
        console.log("chyba");
        throw new Error(`HEIC/HEIF fotku "${image}" sa nepodarilo spracovať cez sharp. Exportujte ju ako JPG a skúste import znova.`);
      }
      throw error;
    }
  }

  await writeJson(path.join(sundayGalleryDirectory, `${date}.json`), {
    id: date,
    date,
    title,
    published: true,
    coverPhotoId: photos[coverIndex]?.id ?? photos[0].id,
    photos,
  });
  runCommand("npm", ["run", "content:generate"]);
}

function formatSundayTitle(date) {
  const [year, month, day] = date.split("-").map(Number);
  return `Nedeľa ${day}. ${month}. ${year}`;
}

async function sundayMenu() {
  const action = await choose("Nedeľné fotografie", [
    { label: "Pridať nedeľu", value: "add" },
    { label: "Spustiť existujúci R2 upload skript", value: "legacy" },
    { label: "Späť", value: "back" },
  ]);
  if (!action || action.value === "back") return;
  if (action.value === "add") await addSundayGallery();
  if (action.value === "legacy") runCommand("npm", ["run", "sunday:upload"], { inherit: true });
}

async function loadSpecialEventFiles() {
  return Promise.all(
    (await listJsonFiles(specialEventsDirectory)).map(async (file) => ({
      file,
      data: await readJson(file),
    })),
  );
}

async function specialEventsMenu() {
  const files = await loadSpecialEventFiles();
  const options = files.map(({ data, file }) => ({ label: `${data.title}${data.published === false ? " (skryté)" : ""}`, value: { data, file } }));
  options.push({ label: "Vytvoriť novú špeciálnu udalosť", value: "new" });
  const selected = await choose("Špeciálne udalosti", options);
  if (!selected) return;

  let file;
  let event;
  if (selected.value === "new") {
    const title = await prompt("Názov udalosti");
    event = { id: slugify(title) || randomUUID(), title, published: true };
    file = path.join(specialEventsDirectory, `${event.id}.json`);
  } else {
    ({ data: event, file } = selected.value);
  }

  event.title = await prompt("Názov", event.title);
  event.date = await prompt("Dátum YYYY-MM-DD (voliteľné)", event.date ?? "");
  if (event.date) assertIsoDate(event.date);
  else delete event.date;
  event.description = await prompt("Krátky popis", event.description ?? "");
  if (!event.description) delete event.description;
  event.published = await confirm("Má byť viditeľná?", event.published !== false);

  const imageAction = await choose("Pozvánka", [
    { label: "Ponechať aktuálnu", value: "keep" },
    { label: "Pridať alebo vymeniť", value: "replace" },
    { label: "Odstrániť", value: "remove" },
  ]);
  if (imageAction?.value === "replace") {
    const inputPath = await prompt("Cesta k obrázku pozvánky");
    const saved = await saveInvitationImage(inputPath, `special-events/${event.id}`, event.id);
    event.invitationImage = saved.src;
    event.invitationWidth = saved.width;
    event.invitationHeight = saved.height;
    event.invitationAlt = `Pozvánka: ${event.title}`;
  }
  if (imageAction?.value === "remove") {
    delete event.invitationImage;
    delete event.invitationAlt;
    delete event.invitationWidth;
    delete event.invitationHeight;
  }

  await writeJson(file, event);
  runCommand("npm", ["run", "content:generate"]);
}

function runCommand(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: rootDirectory,
    stdio: options.inherit ? "inherit" : "pipe",
    encoding: "utf8",
  });
  if (!options.inherit && result.stdout) process.stdout.write(result.stdout);
  if (!options.inherit && result.stderr) process.stderr.write(result.stderr);
  if (result.status !== 0) throw new Error(`Príkaz zlyhal: ${command} ${args.join(" ")}`);
}

async function previewSite() {
  console.log("Spúšťam lokálny náhľad. Otvorte adresu, ktorú vypíše Vite. Ukončenie: Ctrl+C.");
  await new Promise((resolve) => {
    const child = spawn("npm", ["run", "dev"], { cwd: rootDirectory, stdio: "inherit" });
    child.on("exit", resolve);
  });
}

function gitChangedFiles() {
  const result = spawnSync("git", ["status", "--porcelain=v1", "-z", "-uall"], { cwd: rootDirectory, encoding: "utf8" });
  if (result.status !== 0) throw new Error("Nepodarilo sa zistiť git status.");
  const records = result.stdout.split("\0").filter(Boolean);
  const changedFiles = [];

  for (let index = 0; index < records.length; index += 1) {
    const record = records[index];
    if (record.length < 4) continue;

    const status = record.slice(0, 2);
    const filePath = record.slice(3);
    if (filePath) changedFiles.push(filePath);

    if (status.includes("R") || status.includes("C")) {
      const originalPath = records[index + 1];
      if (originalPath) {
        changedFiles.push(originalPath);
        index += 1;
      }
    }
  }

  return [...new Set(changedFiles)];
}

function gitOutput(args) {
  const result = spawnSync("git", args, { cwd: rootDirectory, encoding: "utf8" });
  if (result.status !== 0) return "";
  return result.stdout.trim();
}

function currentPublishTarget() {
  const branch = gitOutput(["branch", "--show-current"]);
  const upstream = gitOutput(["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{u}"]);
  if (!branch || !upstream || !upstream.includes("/")) return null;
  const slashIndex = upstream.indexOf("/");
  return {
    branch,
    remote: upstream.slice(0, slashIndex),
    remoteBranch: upstream.slice(slashIndex + 1),
    upstream,
  };
}

function publishableContentFiles(files) {
  return files.filter((file) => allowedPublishPrefixes.some((prefix) => file === prefix.replace(/\/$/, "") || file.startsWith(prefix)));
}

async function publishChanges() {
  console.log("Kontrolujem obsah...");
  const latestSermonPath = path.join(publicDirectory, "data", "latest-sermon.json");
  const latestSermonBeforeBuild = (await exists(latestSermonPath)) ? await readFile(latestSermonPath, "utf8") : null;
  runCommand("npm", ["run", "content:generate"]);
  runCommand("npm", ["run", "content:check"]);
  runCommand("npm", ["run", "build"]);
  if (latestSermonBeforeBuild !== null) await writeFile(latestSermonPath, latestSermonBeforeBuild);

  const changed = gitChangedFiles();
  const publishable = publishableContentFiles(changed);
  const unrelated = changed.filter((file) => !publishable.includes(file));

  if (!changed.length) {
    console.log("Nie sú tu žiadne zmeny na publikovanie.");
    return;
  }

  console.log("\nZmenené súbory:");
  changed.forEach((file) => console.log(`- ${file}`));

  if (!publishable.length) {
    console.log("\nNenašiel som žiadne obsahové/generované súbory, ktoré patria do automatického publikovania.");
    if (unrelated.length) {
      console.log("Tieto zmeny nechávam nedotknuté:");
      unrelated.forEach((file) => console.log(`- ${file}`));
    }
    return;
  }

  console.log("\nSúbory pripravené na publikovanie:");
  publishable.forEach((file) => console.log(`- ${file}`));

  if (unrelated.length) {
    console.log("\nTieto zmeny nepatria do automatického publikovania a nebudú zahrnuté do commitu:");
    unrelated.forEach((file) => console.log(`- ${file}`));
  }

  const publishTarget = currentPublishTarget();
  if (!publishTarget) {
    console.log("\nNepodarilo sa zistiť aktuálnu vetvu alebo jej upstream. Zmeny som nepridal do commitu.");
    console.log("Skontrolujte git branch/upstream a publikovanie spustite znova.");
    return;
  }

  if (!(await confirm(`Chcete tieto zmeny commitnúť a poslať na ${publishTarget.upstream}?`))) return;
  runCommand("git", ["add", ...publishable]);
  const hasStagedChanges = spawnSync("git", ["diff", "--cached", "--quiet"], { cwd: rootDirectory }).status !== 0;
  if (!hasStagedChanges) {
    console.log("Po stage kroku nie sú pripravené žiadne zmeny na commit.");
    return;
  }
  runCommand("git", ["commit", "-m", "content: update GMC program and galleries"], { inherit: true });
  runCommand("git", ["push", publishTarget.remote, `HEAD:${publishTarget.remoteBranch}`], { inherit: true });
  console.log(`Hotovo. Zmeny sú publikované na ${publishTarget.upstream}; GitHub Pages nasadí web z tejto vetvy.`);
}

async function validateOnly() {
  runCommand("npm", ["run", "content:generate"]);
  runCommand("npm", ["run", "content:check"]);
}

async function mainMenu() {
  await mkdir(programDirectory, { recursive: true });
  await mkdir(specialEventsDirectory, { recursive: true });
  await mkdir(sundayGalleryDirectory, { recursive: true });
  await mkdir(publicInvitationDirectory, { recursive: true });

  if (process.argv.includes("--validate")) {
    await validateOnly();
    return;
  }

  let done = false;
  while (!done) {
    const action = await choose("Čo chcete upraviť?", [
      { label: "Program", value: "program" },
      { label: "Pozvánky", value: "invitations" },
      { label: "Nedeľné fotografie", value: "sundays" },
      { label: "Špeciálne udalosti", value: "special" },
      { label: "Náhľad webu", value: "preview" },
      { label: "Publikovať zmeny", value: "publish" },
      { label: "Koniec", value: "exit" },
    ]);
    try {
      if (!action) continue;
      if (action.value === "program") await programMenu();
      if (action.value === "invitations") {
        const selectedProgram = await chooseProgram();
        if (selectedProgram) {
          await manageProgramInvitations(selectedProgram.data);
          await writeJson(selectedProgram.file, selectedProgram.data);
          runCommand("npm", ["run", "content:generate"]);
        }
      }
      if (action.value === "sundays") await sundayMenu();
      if (action.value === "special") await specialEventsMenu();
      if (action.value === "preview") await previewSite();
      if (action.value === "publish") await publishChanges();
      if (action.value === "exit") done = true;
    } catch (error) {
      console.error(`\nChyba: ${error.message}\n`);
    }
  }
}

mainMenu()
  .catch((error) => {
    console.error(`Chyba content managera: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(() => rl.close());
