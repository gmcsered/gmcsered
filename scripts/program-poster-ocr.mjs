import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isProgramMonthId, programMonthLabel, programMonthName } from "./program-months.mjs";

const scriptsDirectory = path.dirname(fileURLToPath(import.meta.url));
const readerPath = path.join(scriptsDirectory, "read-program-poster.swift");

function plainText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("sk-SK");
}

function cleanText(value) {
  return String(value ?? "")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(value) {
  return plainText(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function parseDate(value, expectedMonth) {
  const match = /^(\d{1,2})\s*\.\s*(\d{1,2})\s*\./.exec(cleanText(value));
  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]);
  if (day < 1 || day > 31 || month !== expectedMonth) return null;
  return { day, month, display: `${day}.${month}.` };
}

function parseTime(value) {
  const match = /^(\d{1,2})\s*[:.]\s*(\d{2})$/.exec(cleanText(value));
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return `${hours}:${String(minutes).padStart(2, "0")}`;
}

function titleCase(value) {
  return cleanText(value)
    .toLocaleLowerCase("sk-SK")
    .replace(/(^|[\s-])\p{L}/gu, (letter) => letter.toLocaleUpperCase("sk-SK"));
}

function titleAndSpeaker(lines) {
  const firstLine = cleanText(lines[0]);
  const normalized = plainText(firstLine);
  const remainingLines = lines.slice(1).map(cleanText).filter(Boolean);

  if (normalized.includes("bohosluzba")) {
    const speakerAfterDash = firstLine.split(/\s[-–—]\s/).slice(1).join(" ").trim();
    const speaker = speakerAfterDash || remainingLines[0] || "";
    return { title: "Nedeľná BOHOSLUŽBA", speaker: speaker ? titleCase(speaker) : "" };
  }

  if (normalized.includes("zaklady") && normalized.includes("zivota")) {
    return {
      title: "Základy kresťanského života",
      speaker: remainingLines[0] ? titleCase(remainingLines[0]) : "",
    };
  }

  const [titlePart, speakerPart] = firstLine.split(/\s[-–—]\s/, 2);
  return {
    title: titleCase(titlePart),
    speaker: speakerPart ? titleCase(speakerPart) : remainingLines[0] ? titleCase(remainingLines[0]) : "",
  };
}

function normalizedObservations(observations) {
  if (!Array.isArray(observations)) throw new Error("Rozpoznanie plagátu nevrátilo zoznam textov.");

  return observations
    .map((observation) => ({
      text: cleanText(observation?.text),
      x: Number(observation?.x),
      y: Number(observation?.y),
    }))
    .filter((observation) => observation.text && Number.isFinite(observation.x) && Number.isFinite(observation.y));
}

export function programFromPosterObservations(observations, monthId) {
  if (!isProgramMonthId(monthId)) throw new Error("Mesiac plagátu musí mať formát YYYY-MM.");

  const month = Number(monthId.slice(5));
  const texts = normalizedObservations(observations);
  const dateRows = texts
    .filter((observation) => observation.x < 0.42)
    .map((observation) => ({ ...observation, date: parseDate(observation.text, month) }))
    .filter((observation) => observation.date)
    .sort((left, right) => right.y - left.y);

  if (!dateRows.length) {
    throw new Error(`Z plagátu ${monthId} sa nepodarilo vyčítať žiadny dátum programu.`);
  }

  const seenDates = new Set();
  const events = dateRows.map((row, index) => {
    const dateKey = row.date.display;
    if (seenDates.has(dateKey)) throw new Error(`Z plagátu ${monthId} sa dátum ${dateKey} vyčítal viackrát.`);
    seenDates.add(dateKey);

    const spacingAbove = dateRows[index - 1]?.y - row.y || row.y - dateRows[index + 1]?.y || 0.08;
    const spacingBelow = row.y - dateRows[index + 1]?.y || dateRows[index - 1]?.y - row.y || 0.08;
    const upperBoundary = Math.min(1, row.y + spacingAbove / 2);
    const lowerBoundary = Math.max(0, row.y - spacingBelow / 2);
    const time = texts
      .filter((observation) => observation.x < 0.42)
      .map((observation) => ({ ...observation, time: parseTime(observation.text) }))
      .filter((observation) => observation.time && Math.abs(observation.y - row.y) < 0.04)
      .sort((left, right) => Math.abs(left.y - row.y) - Math.abs(right.y - row.y))[0]?.time;
    const details = texts
      .filter((observation) => observation.x >= 0.42 && observation.y <= upperBoundary && observation.y >= lowerBoundary)
      .sort((left, right) => right.y - left.y || left.x - right.x)
      .map((observation) => observation.text);

    if (!time) throw new Error(`Pri dátume ${dateKey} sa z plagátu ${monthId} nepodarilo vyčítať čas.`);
    if (!details.length) throw new Error(`Pri dátume ${dateKey} sa z plagátu ${monthId} nepodarilo vyčítať názov udalosti.`);

    const { title, speaker } = titleAndSpeaker(details);
    if (!title) throw new Error(`Pri dátume ${dateKey} sa z plagátu ${monthId} nepodarilo vyčítať názov udalosti.`);

    return {
      id: `${monthId}-${row.date.day}-${time.replace(":", "")}-${slugify(title)}`,
      date: dateKey,
      time,
      title,
      description: speaker,
      ...(speaker ? { speaker } : {}),
      published: true,
    };
  });

  return {
    id: monthId,
    active: true,
    monthLabel: programMonthLabel(monthId),
    title: programMonthName(monthId),
    events,
  };
}

function run(command, argumentsList) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, argumentsList, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) return resolve(stdout);
      reject(new Error(stderr.trim() || `Príkaz ${command} skončil s chybovým kódom ${code}.`));
    });
  });
}

export async function programFromPosterImage(imagePath, monthId) {
  if (process.platform !== "darwin") {
    throw new Error("Automatické čítanie programu z plagátu je dostupné iba na Macu.");
  }

  let output;
  try {
    output = await run("xcrun", ["swift", readerPath, imagePath]);
  } catch (error) {
    throw new Error(`Text z plagátu sa nepodarilo rozpoznať: ${error.message}`);
  }

  try {
    return programFromPosterObservations(JSON.parse(output), monthId);
  } catch (error) {
    throw new Error(`Program z plagátu sa nepodarilo vytvoriť: ${error.message}`);
  }
}
