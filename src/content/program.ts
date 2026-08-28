import monthlyProgram from "./program.json";
import { siteAsset } from "../utils/site";

export type ProgramEvent = {
  id?: string;
  date: string;
  time: string;
  title: string;
  description: string;
  speaker?: string;
  published?: boolean;
  invitationImage?: string;
  invitationAlt?: string;
  invitationWidth?: number;
  invitationHeight?: number;
};

export type ProgramData = {
  id?: string;
  monthLabel: string;
  title: string;
  poster?: string;
  posterAlt?: string;
  posterWidth?: number;
  posterHeight?: number;
  events: ProgramEvent[];
};

type RawProgramData = ProgramData;

const monthlyProgramSource = monthlyProgram as RawProgramData;

// Monthly content is edited in public/content/program/program.txt; program.json is generated automatically.
export const programData: ProgramData = {
  ...monthlyProgramSource,
  ...(monthlyProgramSource.poster ? { poster: siteAsset(monthlyProgramSource.poster) } : {}),
  events: monthlyProgramSource.events.map((event) => ({
    ...event,
    ...(event.invitationImage ? { invitationImage: siteAsset(event.invitationImage) } : {}),
  })),
};
