import { z } from "zod";

export const ALL_TIMEZONES = {
  auckland: { name: "Auckland", label: "NZST / NZDT", offset: 12, gmtLabel: "GMT+12" },
  sydney: { name: "Sydney", label: "AEST / AEDT", offset: 10, gmtLabel: "GMT+10" },
  tokyo: { name: "Tokyo", label: "JST", offset: 9, gmtLabel: "GMT+9" },
  seoul: { name: "Seoul", label: "KST", offset: 9, gmtLabel: "GMT+9" },
  hongKong: { name: "Hong Kong", label: "HKT", offset: 8, gmtLabel: "GMT+8" },
  singapore: { name: "Singapore", label: "SGT", offset: 8, gmtLabel: "GMT+8" },
  bangkok: { name: "Bangkok", label: "ICT", offset: 7, gmtLabel: "GMT+7" },
  jakarta: { name: "Jakarta", label: "WIB", offset: 7, gmtLabel: "GMT+7" },
  mumbai: { name: "Mumbai", label: "IST", offset: 5.5, gmtLabel: "GMT+5:30" },
  dubai: { name: "Dubai", label: "GST", offset: 4, gmtLabel: "GMT+4" },
  moscow: { name: "Moscow", label: "MSK", offset: 3, gmtLabel: "GMT+3" },
  cairo: { name: "Cairo", label: "EET", offset: 2, gmtLabel: "GMT+2" },
  johannesburg: { name: "Johannesburg", label: "SAST", offset: 2, gmtLabel: "GMT+2" },
  berlin: { name: "Berlin", label: "CET / CEST", offset: 1, gmtLabel: "GMT+1" },
  paris: { name: "Paris", label: "CET / CEST", offset: 1, gmtLabel: "GMT+1" },
  london: { name: "London", label: "GMT / BST", offset: 0, gmtLabel: "GMT+0" },
  saoPaulo: { name: "São Paulo", label: "BRT", offset: -3, gmtLabel: "GMT-3" },
  newYork: { name: "New York", label: "EST / EDT", offset: -5, gmtLabel: "GMT-5" },
  toronto: { name: "Toronto", label: "EST / EDT", offset: -5, gmtLabel: "GMT-5" },
  chicago: { name: "Chicago", label: "CST / CDT", offset: -6, gmtLabel: "GMT-6" },
  denver: { name: "Denver", label: "MST / MDT", offset: -7, gmtLabel: "GMT-7" },
  losAngeles: { name: "Los Angeles", label: "PST / PDT", offset: -8, gmtLabel: "GMT-8" },
  vancouver: { name: "Vancouver", label: "PST / PDT", offset: -8, gmtLabel: "GMT-8" },
} as const;

export type TimezoneKey = keyof typeof ALL_TIMEZONES;

export const AVAILABLE_ZONES: TimezoneKey[] = [
  "paris",
  "newYork",
  "losAngeles",
  "tokyo",
  "sydney",
  "dubai",
  "singapore",
  "hongKong",
  "mumbai",
  "berlin",
  "moscow",
  "toronto",
];

export function getSortedTimezones() {
  return Object.entries(ALL_TIMEZONES).sort((a, b) => b[1].offset - a[1].offset);
}

export function detectLocalTimezone(): TimezoneKey {
  const localOffset = -(new Date().getTimezoneOffset() / 60);
  const entries = Object.entries(ALL_TIMEZONES);
  const match = entries.find(([_, tz]) => tz.offset === localOffset);
  if (match) return match[0] as TimezoneKey;
  return "london";
}

export function getTimeInZone(utcBaseTime: Date, offsetHours: number): Date {
  return new Date(utcBaseTime.getTime() + offsetHours * 3600000);
}
