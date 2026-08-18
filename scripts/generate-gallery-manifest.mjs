import { access, mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDirectory = path.join(rootDirectory, "public");
const galleryDirectory = path.join(publicDirectory, "content", "gallery");
const manifestPath = path.join(rootDirectory, "src", "generated", "gallery-manifest.json");
const categoriesPath = path.join(rootDirectory, "src", "content", "galleryCategories.json");
const programPath = path.join(rootDirectory, "src", "content", "program.json");
const supportedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);
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
      warnings.push(`Nepodporovaný súbor galérie: content/gallery/${relativePath}`);
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

function validateProgram(program) {
  if (!program || typeof program !== "object") return "src/content/program.json musí obsahovať objekt.";
  if (!program.monthLabel || !program.title || !program.poster || !program.posterAlt || !Array.isArray(program.events)) {
    return "src/content/program.json musí obsahovať monthLabel, title, poster, posterAlt a events.";
  }

  const invalidEvent = program.events.find(
    (event) => !event || typeof event.date !== "string" || typeof event.time !== "string" || typeof event.title !== "string" || typeof event.description !== "string",
  );
  return invalidEvent ? "Každá programová udalosť musí mať date, time, title a description." : null;
}

async function main() {
  const categories = JSON.parse(await readFile(categoriesPath, "utf8"));
  const program = JSON.parse(await readFile(programPath, "utf8"));
  const programError = validateProgram(program);

  if (programError) throw new Error(programError);

  const posterPath = path.join(publicDirectory, program.poster.replace(/^\//, ""));
  if (!(await exists(posterPath))) throw new Error(`Programový plagát neexistuje: ${program.poster}`);
  if (!Array.isArray(categories) || categories.some((category) => !category.id || !category.folder || !category.title || !category.category || !category.description)) {
    throw new Error("src/content/galleryCategories.json musí obsahovať id, category, title, description a folder pre každú galériu.");
  }

  const manifest = {};
  for (const category of categories) {
    const categoryDirectory = path.join(galleryDirectory, category.folder);
    if (!(await exists(categoryDirectory))) throw new Error(`Chýba priečinok galérie: public/content/gallery/${category.folder}`);
    if (!(await stat(categoryDirectory)).isDirectory()) throw new Error(`Galéria nie je priečinok: public/content/gallery/${category.folder}`);

    const photos = await collectImages(categoryDirectory);
    manifest[category.folder] = photos.map((photo) => `/content/gallery/${category.folder}/${photo}`);
  }

  const output = `${JSON.stringify(manifest, null, 2)}\n`;
  for (const warning of warnings) console.warn(`⚠ ${warning}`);

  if (isCheck) {
    if (warnings.length) throw new Error("Galérie obsahujú nepodporované súbory.");
    if (!(await exists(manifestPath))) throw new Error("Chýba src/generated/gallery-manifest.json. Spustite npm run build.");
    if ((await readFile(manifestPath, "utf8")) !== output) throw new Error("Manifest galérie nie je aktuálny. Spustite npm run build.");
    console.log("Obsah GMC je v poriadku.");
    return;
  }

  await mkdir(path.dirname(manifestPath), { recursive: true });
  await writeFile(manifestPath, output);
  console.log(`Vytvorený manifest galérie pre ${categories.length} kategórií.`);
}

main().catch((error) => {
  console.error(`Chyba kontroly obsahu: ${error.message}`);
  process.exitCode = 1;
});
