import fs from "fs";
import path from "path";
export function bepaalZorgstructuur(route) {
  const file = path.join(process.cwd(), "data", "rules", "zorgstructuur.json");
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  for (const [wet, lijst] of Object.entries(data)) {
    if (lijst.includes(route)) return wet;
  }
  return "onbekend";
}
