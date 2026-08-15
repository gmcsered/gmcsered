import type { ImageAsset } from "./churchContent";

export type ProgramEvent = {
  date: string;
  time: string;
  title: string;
  description: string;
};

export type ProgramData = {
  monthLabel: string;
  title: string;
  poster: ImageAsset;
  events: ProgramEvent[];
};

// Monthly content lives here: update this object for the next month without touching the page layout.
export const programData: ProgramData = {
  monthLabel: "August v GMC Sereď",
  title: "Letný program",
  poster: {
    src: "/assets/church/events/august-program.jpg",
    width: 1120,
    height: 1400,
    alt: "Letný augustový program zboru GMC Sereď",
  },
  events: [
    { date: "1.8.", time: "15:00", title: "Rodinný deň", description: "Spoločný čas pre rodiny a priateľov." },
    { date: "2.8.", time: "9:30", title: "Nedeľná bohoslužba", description: "Pastor Ján Tagaj" },
    { date: "9.8.", time: "9:30", title: "Nedeľná bohoslužba", description: "Pastor Ján Tagaj" },
    { date: "16.8.", time: "9:30", title: "Nedeľná bohoslužba a vodný krst", description: "Pastor Ján Tagaj" },
    { date: "23.8.", time: "9:30", title: "Nedeľná bohoslužba", description: "Pastor Ján Tagaj" },
    { date: "29.8.", time: "15:00", title: "Rodinný deň", description: "Spoločný čas pre rodiny a priateľov." },
    { date: "30.8.", time: "9:30", title: "Nedeľná bohoslužba", description: "Pastor Ján Tagaj" },
  ],
};
