import assert from "node:assert/strict";
import test from "node:test";
import { programFromPosterObservations } from "./program-poster-ocr.mjs";

test("creates a program from the GMC poster layout and corrects common OCR spelling", () => {
  const program = programFromPosterObservations(
    [
      { text: "4.10.", x: 0.21, y: 0.66 },
      { text: "9:30", x: 0.3, y: 0.68 },
      { text: "Nedelhá BOHOSLUŽBA - JÁN TAGAJ", x: 0.63, y: 0.665 },
      { text: "7.10.", x: 0.21, y: 0.59 },
      { text: "18:00", x: 0.3, y: 0.6 },
      { text: "Základy krestanského života", x: 0.63, y: 0.602 },
      { text: "JÁN TAGAJ", x: 0.62, y: 0.576 },
      { text: "21.10.*", x: 0.22, y: 0.293 },
      { text: "18:00", x: 0.3, y: 0.31 },
      { text: "Základy krestanského života", x: 0.62, y: 0.308 },
      { text: "MARTIN POLÁČEK", x: 0.62, y: 0.284 },
    ],
    "2026-10",
  );

  assert.equal(program.monthLabel, "Október 2026");
  assert.deepEqual(program.events, [
    {
      id: "2026-10-4-930-nedelna-bohosluzba",
      date: "4.10.",
      time: "9:30",
      title: "Nedeľná BOHOSLUŽBA",
      description: "Ján Tagaj",
      speaker: "Ján Tagaj",
      published: true,
    },
    {
      id: "2026-10-7-1800-zaklady-krestanskeho-zivota",
      date: "7.10.",
      time: "18:00",
      title: "Základy kresťanského života",
      description: "Ján Tagaj",
      speaker: "Ján Tagaj",
      published: true,
    },
    {
      id: "2026-10-21-1800-zaklady-krestanskeho-zivota",
      date: "21.10.",
      time: "18:00",
      title: "Základy kresťanského života",
      description: "Martin Poláček",
      speaker: "Martin Poláček",
      published: true,
    },
  ]);
});

test("rejects a poster without program dates", () => {
  assert.throws(() => programFromPosterObservations([{ text: "Program", x: 0.5, y: 0.8 }], "2026-10"), /nepodarilo vyčítať žiadny dátum/);
});
