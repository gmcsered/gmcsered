import galleryCategories from "./galleryCategories.json";
import galleryManifest from "../generated/gallery-manifest.json";
import { siteAsset } from "../utils/site";

export type GalleryPhoto = {
  src: string;
  alt: string;
};

export type ChurchLifeGalleryCategory = {
  id: string;
  category: string;
  title: string;
  description: string;
  folder: string;
  cover: GalleryPhoto;
  photos: GalleryPhoto[];
};

type GalleryCategoryConfig = {
  id: string;
  category: string;
  title: string;
  description: string;
  folder: string;
};

const createPhoto = (source: string): GalleryPhoto => ({
  src: siteAsset(source),
  alt: "Fotografia z galérie GMC Sereď",
});

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
