import { homedir } from "node:os";
import path from "node:path";

const shellEscapedCharacterPattern = /\\([\\\s"'`$&;()<>|*?\[\]{}!#~])/g;

function stripSurroundingQuotes(value) {
  if (value.length < 2) return value;
  const first = value.at(0);
  const last = value.at(-1);
  if ((first === '"' && last === '"') || (first === "'" && last === "'")) return value.slice(1, -1);
  return value;
}

export function normalizeUserPathInput(value) {
  if (typeof value !== "string") throw new TypeError("Cesta musí byť text.");

  let normalized = stripSurroundingQuotes(value.trim());
  normalized = normalized.replace(shellEscapedCharacterPattern, "$1");

  if (normalized === "~") return homedir();
  if (normalized.startsWith("~/")) return path.join(homedir(), normalized.slice(2));

  return normalized;
}

export function resolveUserPathInput(value, baseDirectory = process.cwd()) {
  const normalized = normalizeUserPathInput(value);
  return path.resolve(baseDirectory, normalized);
}
