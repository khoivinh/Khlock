#!/usr/bin/env node
/**
 * Derives a lightweight top-cities bundle from the full cities.json.
 * Ships with the JS bundle so the Add Time Zone search is responsive
 * before the 2 MB dataset finishes loading.
 *
 * Usage: node scripts/build-top-cities.mjs
 * Reads:  client/src/data/cities.json
 * Writes: client/src/data/cities-top.json
 *
 * Re-run whenever cities.json changes.
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");
const inputPath = join(projectRoot, "client/src/data/cities.json");
const outputPath = join(projectRoot, "client/src/data/cities-top.json");

const TOP_N = 500;

const raw = JSON.parse(readFileSync(inputPath, "utf-8"));
// Source data is already sorted by population descending (see build-cities.mjs).
const topRows = raw.d.slice(0, TOP_N);

// Rebuild compact deref tables covering only the referenced values.
const countryIdxMap = new Map();
const timezoneIdxMap = new Map();
const provinceIdxMap = new Map();
const c = [];
const t = [];
const p = [];

function remap(val, sourceTable, destTable, map) {
  if (typeof val !== "number") return val;
  const original = sourceTable[val];
  if (!map.has(original)) {
    map.set(original, destTable.length);
    destTable.push(original);
  }
  return map.get(original);
}

const d = topRows.map((row) => [
  row[0],
  row[1],
  row[2],
  row[3],
  row[4],
  remap(row[5], raw.c, c, countryIdxMap),
  row[6],
  remap(row[7], raw.p, p, provinceIdxMap),
  row[8],
  remap(row[9], raw.t, t, timezoneIdxMap),
]);

writeFileSync(outputPath, JSON.stringify({ c, t, p, d }));

const sizeKB = Math.round(readFileSync(outputPath).length / 1024);
console.log(`Wrote ${outputPath} — ${d.length} cities, ${sizeKB} KB.`);
