import "dotenv/config";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { isQualifyingSermon, parseYouTubeDuration, youtubeSermonConfig } from "./youtube-sermon-config.mjs";

const outputFile = resolve("public/data/latest-sermon.json");

const writeFeed = async (sermon) => {
  await mkdir(dirname(outputFile), { recursive: true });
  await writeFile(
    outputFile,
    `${JSON.stringify({ updatedAt: new Date().toISOString(), sermon }, null, 2)}\n`,
    "utf8",
  );
};

const apiRequest = async (path, params) => {
  const url = new URL(`https://www.googleapis.com/youtube/v3/${path}`);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, String(value)));

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`YouTube Data API returned ${response.status}`);
  }

  return response.json();
};

const chooseThumbnail = (thumbnails = {}) =>
  thumbnails.maxres?.url ?? thumbnails.standard?.url ?? thumbnails.high?.url ?? thumbnails.medium?.url ?? thumbnails.default?.url ?? "";

const refresh = async () => {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const sermonPlaylistId = process.env.YOUTUBE_SERMON_PLAYLIST_ID?.trim();

  if (!apiKey) {
    console.warn("YOUTUBE_API_KEY is not set; latest sermon card will use its graceful channel-only fallback.");
    await writeFeed(null);
    return;
  }

  let playlistId = sermonPlaylistId;

  if (!playlistId) {
    const channel = await apiRequest("channels", {
      part: "contentDetails",
      id: youtubeSermonConfig.channelId,
      key: apiKey,
    });
    playlistId = channel.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

    if (!playlistId) {
      throw new Error("Could not resolve the channel uploads playlist.");
    }
  }

  const uploads = await apiRequest("playlistItems", {
    part: "snippet,contentDetails",
    playlistId,
    maxResults: youtubeSermonConfig.maxCandidates,
    key: apiKey,
  });
  const candidateIds = uploads.items
    ?.map((item) => item.contentDetails?.videoId)
    .filter(Boolean)
    .join(",");

  if (!candidateIds) {
    await writeFeed(null);
    return;
  }

  const videos = await apiRequest("videos", {
    part: "snippet,contentDetails",
    id: candidateIds,
    key: apiKey,
  });
  const orderedIds = new Map(uploads.items.map((item, index) => [item.contentDetails?.videoId, index]));
  const orderedVideos = videos.items.sort((left, right) => (orderedIds.get(left.id) ?? Infinity) - (orderedIds.get(right.id) ?? Infinity));
  const selected = sermonPlaylistId
    ? orderedVideos[0]
    : orderedVideos.find((video) =>
        isQualifyingSermon({
          id: video.id,
          title: video.snippet?.title,
          description: video.snippet?.description,
          duration: video.contentDetails?.duration,
        }),
      );

  if (!selected) {
    await writeFeed(null);
    return;
  }

  const title = selected.snippet?.title?.trim();
  const thumbnail = chooseThumbnail(selected.snippet?.thumbnails);

  if (!title || !thumbnail) {
    await writeFeed(null);
    return;
  }

  await writeFeed({
    id: selected.id,
    title,
    thumbnail,
    publishedAt: selected.snippet?.publishedAt ?? "",
    durationSeconds: parseYouTubeDuration(selected.contentDetails?.duration),
    url: `https://www.youtube.com/watch?v=${selected.id}`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${selected.id}`,
    source: sermonPlaylistId ? "playlist" : "channel-filter",
  });
};

refresh().catch(async (error) => {
  console.warn(`Latest sermon refresh skipped: ${error instanceof Error ? error.message : "unknown error"}`);
  await writeFeed(null);
});
