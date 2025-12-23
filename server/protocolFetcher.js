import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { parseTextFromHTML } from "./utils/textParser.js";

const __dirname = path.resolve();

export async function fetchProtocols(klacht) {
  try {
    const sourcesPath = path.join(__dirname, "server", "rules", "sources.json");
    const sourcesData = JSON.parse(fs.readFileSync(sourcesPath, "utf-8"));
    const search = encodeURIComponent(klacht);

    let allText = "";

    // Ga door alle zorgbronnen heen
    for (const [key, src] of Object.entries(sourcesData)) {
      const url = `${src.url}?search=${search}`;
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Fout bij ophalen ${key}`);
        const html = await res.text();
        const tekst = parseTextFromHTML(html);
        allText += `\n\n# ${src.naam} (${key})\n${tekst}`;
      } catch (err) {
        console.warn(`⚠️  Kon ${key} niet laden (${src.url}):`, err.message);
      }
    }

    if (!allText.trim()) {
      return "Geen richtlijnen gevonden voor deze klacht.";
    }

    return allText;
  } catch (err) {
    console.error("❌ ProtocolFetcher crash:", err);
    return "Fout bij ophalen van zorgbronnen.";
  }
}
