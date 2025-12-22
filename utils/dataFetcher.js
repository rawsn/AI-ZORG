// utils/dataFetcher.js
import fetch from "node-fetch";
import * as cheerio from "cheerio";

// Haalt samenvatting op van Thuisarts.nl
export async function fetchThuisarts(query) {
  try {
    const url = `https://www.thuisarts.nl/zoeken/${encodeURIComponent(query)}`;
    const html = await fetch(url).then(r => r.text());
    const $ = cheerio.load(html);
    const result = $(".search-results__title").first().text().trim();
    const text = $(".search-results__teaser").first().text().trim();
    return result ? `Volgens Thuisarts.nl: ${result} – ${text}` : null;
  } catch {
    return null;
  }
}

// Dummy RIVM-informatie
export async function fetchRIVM(topic) {
  const data = {
    griep: "Volgens het RIVM is griep meestal onschuldig. Blijf thuis en rust goed uit.",
    covid: "Volgens het RIVM: bij klachten die kunnen wijzen op corona, blijf thuis en laat u testen."
  };
  return data[topic.toLowerCase()] || null;
}
