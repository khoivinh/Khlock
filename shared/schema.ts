import { z } from "zod";

export const ALL_TIMEZONES = {
  // UTC+12 to UTC+10
  auckland: { name: "Auckland", label: "NZST / NZDT", offset: 12, gmtLabel: "GMT+12" },
  fiji: { name: "Fiji", label: "FJT", offset: 12, gmtLabel: "GMT+12" },
  sydney: { name: "Sydney", label: "AEST / AEDT", offset: 10, gmtLabel: "GMT+10" },
  melbourne: { name: "Melbourne", label: "AEST / AEDT", offset: 10, gmtLabel: "GMT+10" },
  brisbane: { name: "Brisbane", label: "AEST", offset: 10, gmtLabel: "GMT+10" },
  
  // UTC+9
  tokyo: { name: "Tokyo", label: "JST", offset: 9, gmtLabel: "GMT+9" },
  osaka: { name: "Osaka", label: "JST", offset: 9, gmtLabel: "GMT+9" },
  seoul: { name: "Seoul", label: "KST", offset: 9, gmtLabel: "GMT+9" },
  
  // UTC+8
  hongKong: { name: "Hong Kong", label: "HKT", offset: 8, gmtLabel: "GMT+8" },
  singapore: { name: "Singapore", label: "SGT", offset: 8, gmtLabel: "GMT+8" },
  taipei: { name: "Taipei", label: "CST", offset: 8, gmtLabel: "GMT+8" },
  beijing: { name: "Beijing", label: "CST", offset: 8, gmtLabel: "GMT+8" },
  shanghai: { name: "Shanghai", label: "CST", offset: 8, gmtLabel: "GMT+8" },
  kualaLumpur: { name: "Kuala Lumpur", label: "MYT", offset: 8, gmtLabel: "GMT+8" },
  manila: { name: "Manila", label: "PHT", offset: 8, gmtLabel: "GMT+8" },
  perth: { name: "Perth", label: "AWST", offset: 8, gmtLabel: "GMT+8" },
  
  // UTC+7
  bangkok: { name: "Bangkok", label: "ICT", offset: 7, gmtLabel: "GMT+7" },
  jakarta: { name: "Jakarta", label: "WIB", offset: 7, gmtLabel: "GMT+7" },
  hanoi: { name: "Hanoi", label: "ICT", offset: 7, gmtLabel: "GMT+7" },
  hoChiMinhCity: { name: "Ho Chi Minh City", label: "ICT", offset: 7, gmtLabel: "GMT+7" },
  
  // UTC+5:30 to UTC+6
  dhaka: { name: "Dhaka", label: "BST", offset: 6, gmtLabel: "GMT+6" },
  mumbai: { name: "Mumbai", label: "IST", offset: 5.5, gmtLabel: "GMT+5:30" },
  delhi: { name: "Delhi", label: "IST", offset: 5.5, gmtLabel: "GMT+5:30" },
  bangalore: { name: "Bangalore", label: "IST", offset: 5.5, gmtLabel: "GMT+5:30" },
  kolkata: { name: "Kolkata", label: "IST", offset: 5.5, gmtLabel: "GMT+5:30" },
  
  // UTC+5
  karachi: { name: "Karachi", label: "PKT", offset: 5, gmtLabel: "GMT+5" },
  
  // UTC+4
  dubai: { name: "Dubai", label: "GST", offset: 4, gmtLabel: "GMT+4" },
  abuDhabi: { name: "Abu Dhabi", label: "GST", offset: 4, gmtLabel: "GMT+4" },
  
  // UTC+3
  moscow: { name: "Moscow", label: "MSK", offset: 3, gmtLabel: "GMT+3" },
  istanbul: { name: "Istanbul", label: "TRT", offset: 3, gmtLabel: "GMT+3" },
  riyadh: { name: "Riyadh", label: "AST", offset: 3, gmtLabel: "GMT+3" },
  nairobi: { name: "Nairobi", label: "EAT", offset: 3, gmtLabel: "GMT+3" },
  addisAbaba: { name: "Addis Ababa", label: "EAT", offset: 3, gmtLabel: "GMT+3" },
  
  // UTC+2
  cairo: { name: "Cairo", label: "EET", offset: 2, gmtLabel: "GMT+2" },
  johannesburg: { name: "Johannesburg", label: "SAST", offset: 2, gmtLabel: "GMT+2" },
  capeTown: { name: "Cape Town", label: "SAST", offset: 2, gmtLabel: "GMT+2" },
  athens: { name: "Athens", label: "EET / EEST", offset: 2, gmtLabel: "GMT+2" },
  bucharest: { name: "Bucharest", label: "EET / EEST", offset: 2, gmtLabel: "GMT+2" },
  helsinki: { name: "Helsinki", label: "EET / EEST", offset: 2, gmtLabel: "GMT+2" },
  kyiv: { name: "Kyiv", label: "EET / EEST", offset: 2, gmtLabel: "GMT+2" },
  telaviv: { name: "Tel Aviv", label: "IST", offset: 2, gmtLabel: "GMT+2" },
  
  // UTC+1
  berlin: { name: "Berlin", label: "CET / CEST", offset: 1, gmtLabel: "GMT+1" },
  paris: { name: "Paris", label: "CET / CEST", offset: 1, gmtLabel: "GMT+1" },
  madrid: { name: "Madrid", label: "CET / CEST", offset: 1, gmtLabel: "GMT+1" },
  rome: { name: "Rome", label: "CET / CEST", offset: 1, gmtLabel: "GMT+1" },
  amsterdam: { name: "Amsterdam", label: "CET / CEST", offset: 1, gmtLabel: "GMT+1" },
  brussels: { name: "Brussels", label: "CET / CEST", offset: 1, gmtLabel: "GMT+1" },
  vienna: { name: "Vienna", label: "CET / CEST", offset: 1, gmtLabel: "GMT+1" },
  warsaw: { name: "Warsaw", label: "CET / CEST", offset: 1, gmtLabel: "GMT+1" },
  prague: { name: "Prague", label: "CET / CEST", offset: 1, gmtLabel: "GMT+1" },
  stockholm: { name: "Stockholm", label: "CET / CEST", offset: 1, gmtLabel: "GMT+1" },
  oslo: { name: "Oslo", label: "CET / CEST", offset: 1, gmtLabel: "GMT+1" },
  copenhagen: { name: "Copenhagen", label: "CET / CEST", offset: 1, gmtLabel: "GMT+1" },
  zurich: { name: "Zurich", label: "CET / CEST", offset: 1, gmtLabel: "GMT+1" },
  munich: { name: "Munich", label: "CET / CEST", offset: 1, gmtLabel: "GMT+1" },
  milan: { name: "Milan", label: "CET / CEST", offset: 1, gmtLabel: "GMT+1" },
  barcelona: { name: "Barcelona", label: "CET / CEST", offset: 1, gmtLabel: "GMT+1" },
  lagos: { name: "Lagos", label: "WAT", offset: 1, gmtLabel: "GMT+1" },
  
  // UTC+0
  london: { name: "London", label: "GMT / BST", offset: 0, gmtLabel: "GMT+0" },
  dublin: { name: "Dublin", label: "GMT / IST", offset: 0, gmtLabel: "GMT+0" },
  lisbon: { name: "Lisbon", label: "WET / WEST", offset: 0, gmtLabel: "GMT+0" },
  casablanca: { name: "Casablanca", label: "WET", offset: 0, gmtLabel: "GMT+0" },
  accra: { name: "Accra", label: "GMT", offset: 0, gmtLabel: "GMT+0" },
  
  // UTC-3 to UTC-4
  saoPaulo: { name: "São Paulo", label: "BRT", offset: -3, gmtLabel: "GMT-3" },
  buenosAires: { name: "Buenos Aires", label: "ART", offset: -3, gmtLabel: "GMT-3" },
  rioDeJaneiro: { name: "Rio de Janeiro", label: "BRT", offset: -3, gmtLabel: "GMT-3" },
  santiago: { name: "Santiago", label: "CLT / CLST", offset: -3, gmtLabel: "GMT-3" },
  caracas: { name: "Caracas", label: "VET", offset: -4, gmtLabel: "GMT-4" },
  
  // UTC-5
  newYork: { name: "New York", label: "EST / EDT", offset: -5, gmtLabel: "GMT-5" },
  toronto: { name: "Toronto", label: "EST / EDT", offset: -5, gmtLabel: "GMT-5" },
  miami: { name: "Miami", label: "EST / EDT", offset: -5, gmtLabel: "GMT-5" },
  washington: { name: "Washington D.C.", label: "EST / EDT", offset: -5, gmtLabel: "GMT-5" },
  boston: { name: "Boston", label: "EST / EDT", offset: -5, gmtLabel: "GMT-5" },
  atlanta: { name: "Atlanta", label: "EST / EDT", offset: -5, gmtLabel: "GMT-5" },
  bogota: { name: "Bogotá", label: "COT", offset: -5, gmtLabel: "GMT-5" },
  lima: { name: "Lima", label: "PET", offset: -5, gmtLabel: "GMT-5" },
  
  // UTC-6
  chicago: { name: "Chicago", label: "CST / CDT", offset: -6, gmtLabel: "GMT-6" },
  houston: { name: "Houston", label: "CST / CDT", offset: -6, gmtLabel: "GMT-6" },
  dallas: { name: "Dallas", label: "CST / CDT", offset: -6, gmtLabel: "GMT-6" },
  mexicoCity: { name: "Mexico City", label: "CST / CDT", offset: -6, gmtLabel: "GMT-6" },
  
  // UTC-7
  denver: { name: "Denver", label: "MST / MDT", offset: -7, gmtLabel: "GMT-7" },
  phoenix: { name: "Phoenix", label: "MST", offset: -7, gmtLabel: "GMT-7" },
  
  // UTC-8
  losAngeles: { name: "Los Angeles", label: "PST / PDT", offset: -8, gmtLabel: "GMT-8" },
  sanFrancisco: { name: "San Francisco", label: "PST / PDT", offset: -8, gmtLabel: "GMT-8" },
  seattle: { name: "Seattle", label: "PST / PDT", offset: -8, gmtLabel: "GMT-8" },
  vancouver: { name: "Vancouver", label: "PST / PDT", offset: -8, gmtLabel: "GMT-8" },
  
  // UTC-10
  honolulu: { name: "Honolulu", label: "HST", offset: -10, gmtLabel: "GMT-10" },
} as const;

export type TimezoneKey = keyof typeof ALL_TIMEZONES;

export const AVAILABLE_ZONES: TimezoneKey[] = [
  "paris",
  "newYork",
  "losAngeles",
  "london",
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
