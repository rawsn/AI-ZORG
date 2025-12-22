import fs from "fs";
import path from "path";
export function checkMeldplicht(klacht) {
  const file = path.join(process.cwd(), "data", "rules", "meldplicht.json");
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const key = Object.keys(data).find(k => klacht.toLowerCase().includes(k));
  return key ? data[key] : null;
}
