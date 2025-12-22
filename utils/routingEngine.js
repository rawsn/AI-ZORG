import fs from "fs";
import path from "path";
export function getZorgToegang(route) {
  const file = path.join(process.cwd(), "data", "rules", "zorgtoegang.json");
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  return data[route] || { route: "huisarts", verwijzing: true };
}
