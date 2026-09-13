// 디자인 토큰 정적 검사 — src/ 의 화면 코드가 src/styles/tokens.css 의 시멘틱 토큰만 쓰는지 확인한다.
// 사용: node scripts/design-lint.mjs [경로...]   (기본: src)   위반이 있으면 exit 1.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const TOKENS = "src/styles/tokens.css";
const theme = readFileSync(TOKENS, "utf8").match(/@theme\s*{([\s\S]*?)\n}/)[1];
const names = new Set(
  [...theme.matchAll(/^\s*--([a-z0-9-]+?)(?:--[a-z-]+)?:/gm)].map((m) => m[1]).filter((n) => !n.endsWith("-*")),
);
const has = (ns, v) => names.has(`${ns}-${v}`);
const color = (v) => has("color", v) || ["transparent", "current", "inherit"].includes(v);
const num = (v) => /^\d+(\.\d+)?$/.test(v);

// 네임스페이스별 허용 규칙. 값은 variant(md:, hover:)와 opacity(/50)를 뗀 뒤 검사한다.
const RULES = {
  bg: (v) => color(v),
  text: (v) => color(v) || has("text", v) || /^(left|center|right|justify|start|end|ellipsis|clip|nowrap|wrap|balance|pretty)$/.test(v),
  border: (v) => color(v) || num(v) || /^(solid|dashed|dotted|double|none|hidden|collapse|separate)$/.test(v) || /^[trlbxyse]{1,2}(-\d+)?$/.test(v),
  divide: (v) => color(v) || num(v) || /^[xy](-\d+)?$/.test(v),
  ring: (v) => color(v) || num(v) || v === "inset",
  outline: (v) => color(v) || num(v) || /^(none|hidden|solid|dashed|dotted|double|offset-\d+)$/.test(v),
  fill: color, stroke: (v) => color(v) || num(v), from: color, to: color, via: color, decoration: (v) => color(v) || num(v),
  rounded: (v) => has("radius", v) || v === "none" || (/^([trlb]|[tb][lr]|[se]{1,2})-/.test(v) && (has("radius", v.replace(/^[a-z]{1,2}-/, "")) || v.endsWith("-none"))),
  shadow: (v) => has("shadow", v) || color(v) || v === "none",
  font: (v) => has("font-weight", v) || has("font", v),
  z: (v) => has("z-index", v) || v === "auto",
  "max-w": (v) => has("container", v) || num(v) || /^(none|full|min|max|fit|screen|px)$/.test(v),
  ease: (v) => has("ease", v) || v === "linear",
};
const NS = Object.keys(RULES).sort((a, b) => b.length - a.length).join("|");
const CLASS_RE = new RegExp(`(?<![\\w-])((?:[a-z0-9-]+:)*)(${NS})-([a-zA-Z0-9\\-./\\[\\]#%]+)`, "g");

const LITERALS = [
  [/#[0-9a-fA-F]{3,8}\b/, "HEX 색 리터럴 — 시멘틱 색 토큰을 쓴다"],
  [/\b(rgba?|hsla?|oklch)\(/, "색 함수 리터럴 — 시멘틱 색 토큰을 쓴다"],
  [/--ms-[a-z0-9-]+/, "프리미티브(--ms-*) 직접 참조 — 시멘틱 토큰만 쓴다"],
  [/\b(fontFamily|font-family)\b(?![^;}]*var\()|\b(Arial|Helvetica|Roboto|Pretendard)\b/, "서체 리터럴 — font-sans 토큰을 쓴다"],
  [/\[[^\]]*(#|px|rem|em)[^\]]*\]/, "임의값(arbitrary value) — 토큰 유틸리티를 쓴다"],
];

function walk(dir, out = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(tsx|ts|css)$/.test(f) && !/\.test\./.test(f) && p !== TOKENS) out.push(p);
  }
  return out;
}

const targets = process.argv.slice(2).length ? process.argv.slice(2) : ["src"];
const files = targets.flatMap((t) => (statSync(t).isDirectory() ? walk(t) : [t]));
const findings = [];
let checked = 0;

for (const file of files) {
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    if (/^\s*(\/\/|\/\*|\*|\{\/\*)/.test(line)) return; // 주석 제외(JSX 주석 포함)
    for (const [re, msg] of LITERALS) if (re.test(line)) findings.push({ file, line: i + 1, what: line.match(re)[0], msg });
    if (file.endsWith(".css")) return;
    for (const m of line.matchAll(CLASS_RE)) {
      const [, , ns, raw] = m;
      const v = raw.replace(/\/.*$/, "");
      if (/^\d+$/.test(v) && ns !== "z") continue; // 간격·크기 숫자 유틸(px-4, border-2)은 허용
      checked++;
      if (!RULES[ns](v)) findings.push({ file, line: i + 1, what: `${ns}-${raw}`, msg: `tokens.css 에 없는 ${ns} 값 — 컴파일되지 않거나 토큰 밖 값` });
    }
  });
}

for (const f of findings) console.log(`${relative(".", f.file)}:${f.line}  ${f.what}  ← ${f.msg}`);
console.log(findings.length ? `design-lint: ${findings.length}건 위반` : `design-lint: OK (${files.length} files, ${checked} classes)`);
process.exit(findings.length ? 1 : 0);
