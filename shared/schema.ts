import { z } from "zod";

export const timezoneSchema = z.object({
  id: z.string(),
  city: z.string(),
  timezone: z.string(),
  gmtOffset: z.string(),
  order: z.number(),
});

export const insertTimezoneSchema = timezoneSchema.omit({ id: true, order: true });

export type Timezone = z.infer<typeof timezoneSchema>;
export type InsertTimezone = z.infer<typeof insertTimezoneSchema>;

export const AVAILABLE_TIMEZONES: { city: string; timezone: string; gmtOffset: string }[] = [
  { city: "New York", timezone: "America/New_York", gmtOffset: "GMT-5" },
  { city: "Los Angeles", timezone: "America/Los_Angeles", gmtOffset: "GMT-8" },
  { city: "Chicago", timezone: "America/Chicago", gmtOffset: "GMT-6" },
  { city: "Denver", timezone: "America/Denver", gmtOffset: "GMT-7" },
  { city: "London", timezone: "Europe/London", gmtOffset: "GMT+0" },
  { city: "Paris", timezone: "Europe/Paris", gmtOffset: "GMT+1" },
  { city: "Berlin", timezone: "Europe/Berlin", gmtOffset: "GMT+1" },
  { city: "Rome", timezone: "Europe/Rome", gmtOffset: "GMT+1" },
  { city: "Madrid", timezone: "Europe/Madrid", gmtOffset: "GMT+1" },
  { city: "Amsterdam", timezone: "Europe/Amsterdam", gmtOffset: "GMT+1" },
  { city: "Moscow", timezone: "Europe/Moscow", gmtOffset: "GMT+3" },
  { city: "Dubai", timezone: "Asia/Dubai", gmtOffset: "GMT+4" },
  { city: "Mumbai", timezone: "Asia/Kolkata", gmtOffset: "GMT+5:30" },
  { city: "Singapore", timezone: "Asia/Singapore", gmtOffset: "GMT+8" },
  { city: "Hong Kong", timezone: "Asia/Hong_Kong", gmtOffset: "GMT+8" },
  { city: "Shanghai", timezone: "Asia/Shanghai", gmtOffset: "GMT+8" },
  { city: "Tokyo", timezone: "Asia/Tokyo", gmtOffset: "GMT+9" },
  { city: "Seoul", timezone: "Asia/Seoul", gmtOffset: "GMT+9" },
  { city: "Sydney", timezone: "Australia/Sydney", gmtOffset: "GMT+11" },
  { city: "Melbourne", timezone: "Australia/Melbourne", gmtOffset: "GMT+11" },
  { city: "Auckland", timezone: "Pacific/Auckland", gmtOffset: "GMT+13" },
  { city: "Honolulu", timezone: "Pacific/Honolulu", gmtOffset: "GMT-10" },
  { city: "Toronto", timezone: "America/Toronto", gmtOffset: "GMT-5" },
  { city: "Vancouver", timezone: "America/Vancouver", gmtOffset: "GMT-8" },
  { city: "Mexico City", timezone: "America/Mexico_City", gmtOffset: "GMT-6" },
  { city: "Sao Paulo", timezone: "America/Sao_Paulo", gmtOffset: "GMT-3" },
  { city: "Buenos Aires", timezone: "America/Argentina/Buenos_Aires", gmtOffset: "GMT-3" },
  { city: "Cairo", timezone: "Africa/Cairo", gmtOffset: "GMT+2" },
  { city: "Johannesburg", timezone: "Africa/Johannesburg", gmtOffset: "GMT+2" },
  { city: "Lagos", timezone: "Africa/Lagos", gmtOffset: "GMT+1" },
  { city: "Istanbul", timezone: "Europe/Istanbul", gmtOffset: "GMT+3" },
  { city: "Bangkok", timezone: "Asia/Bangkok", gmtOffset: "GMT+7" },
  { city: "Jakarta", timezone: "Asia/Jakarta", gmtOffset: "GMT+7" },
  { city: "Taipei", timezone: "Asia/Taipei", gmtOffset: "GMT+8" },
  { city: "Manila", timezone: "Asia/Manila", gmtOffset: "GMT+8" },
];
