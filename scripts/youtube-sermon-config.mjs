export const youtubeSermonConfig = {
  channelId: "UCMHN6nrExc1cN6TF8K0phCw",
  channelUrl: "https://www.youtube.com/@JanTagaj",
  minimumDurationSeconds: 18 * 60,
  maxCandidates: 50,
  inclusionTerms: [
    "kázeň",
    "božie slovo",
    "biblické vyučovanie",
    "nedeľné posolstvo",
    "posolstvo",
    "bohoslužba",
    "nedeľa",
    "nedela",
  ],
  exclusionTerms: [
    "shorts",
    "short",
    "reel",
    "pozvánka",
    "pozvanka",
    "pozvanie",
    "invitácia",
    "invitacia",
    "invite",
    "oznam",
    "oznámenie",
    "oznamenie",
    "announcement",
    "promo",
    "upútavka",
    "uputavka",
    "teaser",
    "trailer",
    "reklama",
  ],
};

const normalize = (value = "") =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("sk");

const hasTerm = (value, terms) => terms.some((term) => value.includes(normalize(term)));

const hasSundayDate = (title) => /\b\d{1,2}[./-]\d{1,2}(?:[./-]\d{2,4})?\b/.test(title);

export const parseYouTubeDuration = (duration = "") => {
  const match = duration.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);

  if (!match) {
    return 0;
  }

  return Number(match[1] ?? 0) * 3600 + Number(match[2] ?? 0) * 60 + Number(match[3] ?? 0);
};

export const isQualifyingSermon = ({ title = "", description = "", duration = "", id = "" }) => {
  const normalizedText = normalize(`${title} ${description}`);
  const durationSeconds = parseYouTubeDuration(duration);
  const isShortUrl = String(id).includes("/shorts/");

  if (isShortUrl || durationSeconds < youtubeSermonConfig.minimumDurationSeconds) {
    return false;
  }

  if (hasTerm(normalizedText, youtubeSermonConfig.exclusionTerms)) {
    return false;
  }

  return hasTerm(normalizedText, youtubeSermonConfig.inclusionTerms) || hasSundayDate(title);
};
