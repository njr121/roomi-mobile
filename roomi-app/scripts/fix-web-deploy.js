// expo export -p web 직후 dist/assets/node_modules 경로를 Vercel이 강제로 제외시키는 문제 우회.
// dist는 매번 새로 생성되므로 매번 다시 적용해야 함 (error-log.md 260624 항목 참고).
const fs = require("fs");
const path = require("path");

const distDir = path.join(__dirname, "..", "dist");
const brokenDir = path.join(distDir, "assets", "node_modules");
const fixedDir = path.join(distDir, "assets", "vendor");

if (!fs.existsSync(brokenDir)) {
  console.log("assets/node_modules 없음 — 건너뜀");
  process.exit(0);
}

fs.renameSync(brokenDir, fixedDir);

const jsDir = path.join(distDir, "_expo", "static", "js", "web");
for (const file of fs.readdirSync(jsDir)) {
  if (!file.endsWith(".js")) continue;
  const filePath = path.join(jsDir, file);
  const content = fs.readFileSync(filePath, "utf8");
  if (!content.includes("assets/node_modules")) continue;
  fs.writeFileSync(filePath, content.split("assets/node_modules").join("assets/vendor"));
  console.log(`치환 완료: ${file}`);
}

console.log("assets/node_modules -> assets/vendor 변경 완료");
