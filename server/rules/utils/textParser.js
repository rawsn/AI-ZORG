import { load } from "cheerio";

// Vereenvoudigde HTML-parser
export function parseTextFromHTML(html) {
  const $ = load(html);
  const text = $("p, li").text();
  return text.replace(/\s+/g, " ").trim();
}
