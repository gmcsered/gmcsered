import { homedir } from "node:os";
import { mkdtempSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

import { normalizeUserPathInput, resolveUserPathInput } from "./content-paths.mjs";

test("keeps a plain path with spaces", () => {
  assert.equal(
    normalizeUserPathInput("/Users/monikasabova/Desktop/Sunday Service Church Event Instagram Post.PNG"),
    "/Users/monikasabova/Desktop/Sunday Service Church Event Instagram Post.PNG",
  );
});

test("normalizes Finder/Terminal escaped spaces", () => {
  assert.equal(
    normalizeUserPathInput(String.raw`/Users/monikasabova/Desktop/Sunday\ Service\ Church\ Event\ Instagram\ Post.PNG`),
    "/Users/monikasabova/Desktop/Sunday Service Church Event Instagram Post.PNG",
  );
});

test("removes matching surrounding quotes", () => {
  assert.equal(normalizeUserPathInput('"/Users/monikasabova/Desktop/Sunday Service.PNG"'), "/Users/monikasabova/Desktop/Sunday Service.PNG");
  assert.equal(normalizeUserPathInput("'/Users/monikasabova/Desktop/Sunday Service.PNG'"), "/Users/monikasabova/Desktop/Sunday Service.PNG");
});

test("expands home directory shorthand", () => {
  assert.equal(resolveUserPathInput("~/Desktop/Sunday Service.PNG"), path.join(homedir(), "Desktop", "Sunday Service.PNG"));
});

test("plain and escaped paths resolve to the same existing file", () => {
  const directory = mkdtempSync(path.join(tmpdir(), "gmc-content-paths-"));
  try {
    const filePath = path.join(directory, "Sunday Service Church Event Instagram Post.PNG");
    writeFileSync(filePath, "test");
    const escapedPath = path.join(directory, String.raw`Sunday\ Service\ Church\ Event\ Instagram\ Post.PNG`);

    assert.equal(resolveUserPathInput(filePath), filePath);
    assert.equal(resolveUserPathInput(escapedPath), filePath);
    assert.equal(existsSync(resolveUserPathInput(escapedPath)), true);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("does not remove non-shell backslashes blindly", () => {
  assert.equal(normalizeUserPathInput(String.raw`/tmp/photo\x.png`), String.raw`/tmp/photo\x.png`);
});
