import fs from "fs";
import path from "path";

export function loadSql(fileName: string) {
  return fs.readFileSync(path.join(__dirname, fileName), "utf8");
}
