import readline from "node:readline"
import { stdin as input, stdout as output } from 'node:process';
import fs from "node:fs";
import path from "node:path";

const isObject = (val: any) =>
  typeof val === "object" && val !== null && !Array.isArray(val);

function compareKeys(base: any, target: any, path = "") {
     if (typeof target !== "object" || target === null) {
          console.error(`❌ Invalid structure at: ${path}`);
          return;
     }
     for (const key in base) {
          const fullPath = path ? `${path}.${key}` : key;

          if (!(key in target)) {
               console.error(`❌ Missing key: ${fullPath}`);
               continue;
          }

          const baseVal = base[key];
          const targetVal = target[key];

          if (typeof baseVal !== typeof targetVal) {
               console.warn(`⚠️ Type mismatch at ${fullPath}`);
          }

          if (isObject(baseVal)) {
               compareKeys(baseVal, targetVal, fullPath);
          }
     }
}

function compareLocales(baseLang: string, targetLang: string) {
     const baseDir = path.join(process.cwd(), "public", "locales", baseLang);
     const targetDir = path.join(process.cwd(), "public", "locales", targetLang);

     const baseFiles = fs.readdirSync(baseDir);

     for (const file of baseFiles) {
          const basePath = path.join(baseDir, file);
          const targetPath = path.join(targetDir, file);

          if (!fs.existsSync(targetPath)) {
               console.error(`❌ Missing file: ${targetLang}/${file}`);
               continue;
          }

          const baseJSON = JSON.parse(fs.readFileSync(basePath, "utf-8"));
          const targetJSON = JSON.parse(fs.readFileSync(targetPath, "utf-8"));

          console.log(`\n🔍 Checking: ${file}`);
          compareKeys(baseJSON, targetJSON, file.replace(".json", ""));
     }
}

const rl = readline.createInterface({ input, output });

rl.question("Enter a lang code (e.g. es, pl, hy, or ru): ",lang=>{
     try {
          compareLocales("en", lang);
          console.log("\n✅ Done");
     } catch (err) {
          console.error("❌ Error:", err);
     }
     rl.close();
})