import monthlyProgram from "./program.json";
import { siteAsset } from "../utils/site";

export type ProgramEvent = {
  date: string;
  time: string;
  title: string;
  description: string;
  invitationImage?: string;
  invitationAlt?: string;
  invitationWidth?: number;
  invitationHeight?: number;
};

export type ProgramData = {
  monthLabel: string;
  title: string;
  poster: string;
  posterAlt: string;
  events: ProgramEvent[];
};

type RawProgramData = ProgramData;

const monthlyProgramSource = monthlyProgram as RawProgramData;

// Monthly content is edited in public/content/program/program.txt; program.json is generated automatically.
export const programData: ProgramData = {
  ...monthlyProgramSource,
  poster: siteAsset(monthlyProgramSource.poster),
  events: monthlyProgramSource.events.map((event) => ({
    ...event,
    ...(event.invitationImage ? { invitationImage: siteAsset(event.invitationImage) } : {}),
  })),
};
