import galleryCategories from "./galleryCategories.json";
import galleryManifest from "../generated/gallery-manifest.json";
import { siteAsset } from "../utils/site";

export type GalleryPhoto = {
  src: string;
  alt: string;
  caption: string;
};

export type ChurchLifeGalleryCategory = {
  id: string;
  category: string;
  title: string;
  folder: string;
  cover: GalleryPhoto;
  photos: GalleryPhoto[];
};

type GalleryCategoryConfig = {
  id: string;
  category: string;
  title: string;
  folder: string;
};

const toCaption = (source: string) => {
  const filename = source.split("/").pop()?.replace(/\.[^.]+$/, "") ?? "Fotografia";
  return filename
    .replace(/^\d{4}-\d{2}-\d{2}[-_]?/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toLocaleUpperCase("sk"));
};

const createPhoto = (source: string): GalleryPhoto => {
  const caption = toCaption(source);
  return {
    src: siteAsset(source),
    alt: `${caption} v GMC Sereď`,
    caption,
  };
};

const manifest = galleryManifest as Record<string, string[]>;

// This is assembled from public/content/gallery during the build. Never list new photos here.
export const churchLifeGalleries: ChurchLifeGalleryCategory[] = (galleryCategories as GalleryCategoryConfig[])
  .map((gallery) => {
    const photos = (manifest[gallery.folder] ?? []).map(createPhoto);
    return {
      ...gallery,
      cover: photos[0],
      photos,
    };
  })
  .filter((gallery): gallery is ChurchLifeGalleryCategory => gallery.cover !== undefined);
