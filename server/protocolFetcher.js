import fetch from "node-fetch";
import { parseTextFromHTML } from "./utils/textParser.js";

export async function fetchProtocols(klacht) {
  const searchTerms = encodeURIComponent(klacht);
  const sources = [
    `https://www.thuisarts.nl/zoek?search=${searchTerms}`,
    `https://richtlijnen.nhg.org/search?query=${searchTerms}`,
    `https://www.rivm.nl/zoeken?keys=${searchTerms}`
  ];

  let allText = "";

  for (const url of sources) {
    try {
      const res = await fetch(url);
      const html = await res.text();
      const cleanText = parseTextFromHTML(html);
      allText += `\nBron: ${url}\n${cleanText}`;
    } catch {
      console.warn(`Kon bron niet laden: ${url}`);
    }
  }

  return allText || "Geen richtlijnen gevonden.";
}
