import specialEventsFile from "./specialEvents.json";
import { siteAsset } from "../utils/site";

export type SpecialEvent = {
  id: string;
  title: string;
  description?: string;
  date?: string;
  published?: boolean;
  sortOrder?: number;
  invitationImage?: string;
  invitationAlt?: string;
  invitationWidth?: number;
  invitationHeight?: number;
};

type SpecialEventsFile = {
  events: SpecialEvent[];
};

export const specialEvents = (specialEventsFile as SpecialEventsFile).events.map((event) => ({
  ...event,
  ...(event.invitationImage ? { invitationImage: siteAsset(event.invitationImage) } : {}),
}));
