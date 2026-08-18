import sundays from "./sundays.json";
import { siteAsset } from "../utils/site";

export type SundayArchivePhoto = {
  thumbnail: string;
  full: string;
  alt?: string;
};

export type SundayArchiveGallery = {
  date: string;
  title: string;
  photos: SundayArchivePhoto[];
};

export type SundayArchiveItem = {
  date: string;
  title: string;
  cover: string;
  photoCount: number;
  manifest: string;
};

type SundayArchiveFile = {
  sundays: SundayArchiveItem[];
};

// Sundays are long-term chronological archives. Only lightweight metadata lives in Git.
export const sundayArchive = (sundays as SundayArchiveFile).sundays.map((sunday) => ({
  ...sunday,
  manifest: siteAsset(sunday.manifest),
}));
