import fs from "fs";
import path from "path";
export function getLegalInfo() {
  const file = path.join(process.cwd(), "data", "rules", "legal_knmg.json");
  return JSON.parse(fs.readFileSync(file, "utf8"));
}
