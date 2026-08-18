import monthlyProgram from "./program.json";
import { siteAsset } from "../utils/site";

export type ProgramEvent = {
  date: string;
  time: string;
  title: string;
  description: string;
};

export type ProgramData = {
  monthLabel: string;
  title: string;
  poster: string;
  posterAlt: string;
  events: ProgramEvent[];
};

// Monthly content is edited in public/content/program/program.txt; program.json is generated automatically.
export const programData: ProgramData = {
  ...monthlyProgram,
  poster: siteAsset(monthlyProgram.poster),
};
