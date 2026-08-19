import "dotenv/config";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { youtubeLatestVideoConfig } from "./youtube-sermon-config.mjs";

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
    let message = response.statusText;

    try {
      const payload = await response.json();
      message = payload?.error?.message || message;
    } catch {
      // Keep the public status text if the API response is not JSON.
    }

    throw new Error(`YouTube Data API ${response.status}: ${message}`);
  }

  return response.json();
};

const chooseThumbnail = (thumbnails = {}) =>
  thumbnails.maxres?.url ?? thumbnails.standard?.url ?? thumbnails.high?.url ?? thumbnails.medium?.url ?? thumbnails.default?.url ?? "";

const refresh = async () => {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    console.warn("YOUTUBE_API_KEY is not set; latest-video data will use its graceful channel-only fallback.");
    await writeFeed(null);
    return;
  }

  const channel = await apiRequest("channels", {
    part: "contentDetails",
    forHandle: youtubeLatestVideoConfig.handle,
    key: apiKey,
  });
  const resolvedChannel = channel.items?.[0];
  const channelId = resolvedChannel?.id;
  const uploadsPlaylistId = resolvedChannel?.contentDetails?.relatedPlaylists?.uploads;

  if (!channelId || !uploadsPlaylistId) {
    throw new Error(`Could not resolve the uploads playlist for @${youtubeLatestVideoConfig.handle}.`);
  }

  const uploads = await apiRequest("playlistItems", {
    part: "snippet,contentDetails",
    playlistId: uploadsPlaylistId,
    maxResults: 1,
    key: apiKey,
  });
  const latest = uploads.items?.[0];
  const id = latest?.contentDetails?.videoId;
  const title = latest?.snippet?.title?.trim();
  const thumbnail = chooseThumbnail(latest?.snippet?.thumbnails);

  if (!id || !title || !thumbnail) {
    console.warn(`No public YouTube video is available yet for @${youtubeLatestVideoConfig.handle}; using the channel fallback.`);
    await writeFeed(null);
    return;
  }

  await writeFeed({
    id,
    title,
    thumbnail,
    publishedAt: latest.contentDetails?.videoPublishedAt ?? latest.snippet?.publishedAt ?? "",
    url: `https://www.youtube.com/watch?v=${id}`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${id}`,
  });

  console.log(`Latest YouTube video refreshed: ${title} (${id}) from @${youtubeLatestVideoConfig.handle}; channel ${channelId}.`);
};

refresh().catch((error) => {
  console.error(`Latest YouTube video refresh failed: ${error instanceof Error ? error.message : "unknown error"}`);
  process.exitCode = 1;
});
