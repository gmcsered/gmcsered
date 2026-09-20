function normalizeHash(value) {
  if (typeof value !== "string") return null;
  const hash = value.trim().toLowerCase();
  return /^[a-f0-9]{24,64}$/.test(hash) ? hash : null;
}

export function hashesMatch(left, right) {
  const normalizedLeft = normalizeHash(left);
  const normalizedRight = normalizeHash(right);
  if (!normalizedLeft || !normalizedRight) return false;
  return normalizedLeft === normalizedRight || normalizedLeft.startsWith(normalizedRight) || normalizedRight.startsWith(normalizedLeft);
}

export function hashFromR2Url(url) {
  if (typeof url !== "string") return null;
  const match = /\/sundays\/\d{4}-\d{2}-\d{2}\/(?:thumbs\/)?([a-f0-9]{24,64})\.webp(?:[?#]|$)/i.exec(url);
  return normalizeHash(match?.[1]);
}

export function publishedPhotoHash(photo) {
  return normalizeHash(photo?.hash) ?? hashFromR2Url(photo?.full) ?? hashFromR2Url(photo?.thumbnail);
}

function normalizePublishedPhoto(photo) {
  const hash = publishedPhotoHash(photo);
  return {
    ...photo,
    ...(hash ? { hash } : {}),
  };
}

export function findPublishedPhotoByHash(photos, hash) {
  return photos.find((photo) => hashesMatch(publishedPhotoHash(photo), hash)) ?? null;
}

export function mergeSundayGallery({ date, title, existingManifest, existingSummary, incomingPhotos }) {
  const existingPhotos = Array.isArray(existingManifest?.photos) ? existingManifest.photos.map(normalizePublishedPhoto) : [];
  const additions = [];
  let duplicatesSkipped = 0;

  for (const photo of incomingPhotos) {
    if (findPublishedPhotoByHash([...existingPhotos, ...additions], photo.hash)) {
      duplicatesSkipped += 1;
      continue;
    }
    additions.push({ ...photo, hash: normalizeHash(photo.hash) ?? photo.hash });
  }

  const photos = [...existingPhotos, ...additions];
  const manifest = {
    ...(existingManifest ?? {}),
    date,
    title: existingManifest?.title ?? title,
    photos,
  };
  const summary = {
    ...(existingSummary ?? {}),
    date,
    title: manifest.title,
    cover: existingSummary?.cover ?? photos[0]?.thumbnail,
    photoCount: photos.length,
    manifest: `/content/sundays/${date}.json`,
  };

  return {
    manifest,
    summary,
    existingCount: existingPhotos.length,
    newCount: additions.length,
    duplicatesSkipped,
  };
}
