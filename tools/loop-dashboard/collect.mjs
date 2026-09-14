// 루프 비용 수집기 — ~/.claude/projects/**/*.jsonl 을 읽어 세션(=루프)별 토큰·비용을 집계한다.
// 단독 실행: node collect.mjs          (콘솔 표)
//            node collect.mjs --json   (JSON)
// 명세: docs/loop-비용-모니터링-계획.md §5, §6.2
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const PROJECTS = join(process.env.CLAUDE_CONFIG_DIR ?? join(homedir(), ".claude"), "projects");
const M = 1_000_000;

function loadPrices() {
  return JSON.parse(readFileSync(join(HERE, "prices.json"), "utf8"));
}

function readLines(file) {
  const out = [];
  for (const line of readFileSync(file, "utf8").split("\n")) {
    if (!line) continue;
    try { out.push(JSON.parse(line)); } catch { /* 덜 쓰인 마지막 줄 등은 건너뛴다 */ }
  }
  return out;
}

// 세션 하나 = 메인 파일 + <sessionId>/subagents/*.jsonl
function sessionFiles(dir, sessionId) {
  const files = [{ file: join(dir, `${sessionId}.jsonl`), sub: false }];
  const subDir = join(dir, sessionId, "subagents");
  if (existsSync(subDir)) {
    for (const f of readdirSync(subDir)) if (f.endsWith(".jsonl")) files.push({ file: join(subDir, f), sub: true });
  }
  return files;
}

// §5.2 응답 하나의 비용. 단가 없으면 null.
export function messageCost(usage, price) {
  if (!price || price.inputUsdPerMtok == null || price.outputUsdPerMtok == null) return null;
  const { input, output, cacheWrite5m, cacheWrite1h, cacheRead } = usage;
  const pin = price.inputUsdPerMtok, pout = price.outputUsdPerMtok;
  return (input * pin + output * pout + cacheWrite5m * pin * 1.25 + cacheWrite1h * pin * 2 + cacheRead * pin * 0.1) / M;
}

export function normalizeUsage(u = {}) {
  let w5 = u.cache_creation?.ephemeral_5m_input_tokens ?? 0;
  let w1 = u.cache_creation?.ephemeral_1h_input_tokens ?? 0;
  const wTotal = u.cache_creation_input_tokens ?? 0;
  if (w5 === 0 && w1 === 0 && wTotal > 0) w5 = wTotal; // 세부 내역 없으면 5분 쓰기로 간주
  return { input: u.input_tokens ?? 0, output: u.output_tokens ?? 0, cacheWrite5m: w5, cacheWrite1h: w1, cacheRead: u.cache_read_input_tokens ?? 0 };
}

const zero = () => ({ input: 0, output: 0, cacheWrite5m: 0, cacheWrite1h: 0, cacheRead: 0 });
const add = (a, b) => { for (const k in a) a[k] += b[k]; return a; };

export function collectSession(dir, sessionId, prices) {
  const byId = new Map(); // message.id → 마지막 레코드 (§5.1 중복 제거)
  let title = null, firings = 0, isLoop = false, first = null, last = null;
  for (const { file, sub } of sessionFiles(dir, sessionId)) {
    for (const r of readLines(file)) {
      if (r.timestamp) { if (!first || r.timestamp < first) first = r.timestamp; if (!last || r.timestamp > last) last = r.timestamp; }
      if (r.type === "ai-title" && r.aiTitle) title = r.aiTitle;
      else if (r.type === "queue-operation") { isLoop = true; if (r.operation === "enqueue") firings++; }
      else if (r.type === "user" && typeof r.message?.content === "string" && r.message.content.includes("<command-name>/loop</command-name>")) isLoop = true;
      else if (r.type === "assistant" && r.message?.id && r.message?.usage) byId.set(r.message.id, { ts: r.timestamp, model: r.message.model ?? "unknown", usage: normalizeUsage(r.message.usage), sub });
    }
  }
  const tokens = zero(), byModel = new Map(), unpriced = new Set(), perMessage = [];
  let costUsd = 0, subagentCostUsd = 0, priced = true;
  for (const m of [...byId.values()].sort((a, b) => (a.ts ?? "").localeCompare(b.ts ?? ""))) {
    add(tokens, m.usage);
    const c = messageCost(m.usage, prices.models[m.model]);
    if (c == null) { unpriced.add(m.model); priced = false; } else { costUsd += c; if (m.sub) subagentCostUsd += c; }
    const bm = byModel.get(m.model) ?? { model: m.model, costUsd: 0, tokens: zero() };
    add(bm.tokens, m.usage); bm.costUsd += c ?? 0; byModel.set(m.model, bm);
    perMessage.push({ ts: m.ts, ctxTokens: m.usage.input + m.usage.cacheWrite5m + m.usage.cacheWrite1h + m.usage.cacheRead, costUsd: c });
  }
  return {
    sessionId, title: title ?? sessionId.slice(0, 8), isLoop, firstSeen: first, lastSeen: last,
    firings, // ponytail: enqueue 에는 task-notification 도 섞인다. 발효만 세려면 content 로 구분해야 함
    messages: byId.size, tokens, costUsd: priced ? costUsd : null, unpricedModels: [...unpriced],
    byModel: [...byModel.values()].map((b) => ({ ...b, costUsd: unpriced.has(b.model) ? null : b.costUsd })),
    subagentCostUsd: priced ? subagentCostUsd : null, perMessage,
  };
}

export function collect() {
  const prices = loadPrices();
  const projects = [];
  if (!existsSync(PROJECTS)) return { generatedAt: new Date().toISOString(), projects };
  for (const slug of readdirSync(PROJECTS)) {
    const dir = join(PROJECTS, slug);
    if (!statSync(dir).isDirectory()) continue;
    const sessions = readdirSync(dir).filter((f) => f.endsWith(".jsonl")).map((f) => collectSession(dir, f.slice(0, -6), prices))
      .filter((s) => s.messages > 0)
      .sort((a, b) => (b.costUsd ?? -1) - (a.costUsd ?? -1));
    if (sessions.length) projects.push({ slug, sessions });
  }
  return { generatedAt: new Date().toISOString(), krwPerUsd: prices.krwPerUsd, projects };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const data = collect();
  if (process.argv.includes("--json")) console.log(JSON.stringify(data));
  else {
    const rows = data.projects.flatMap((p) => p.sessions.map((s) => ({
      제목: s.title.slice(0, 30), 프로젝트: p.slug.slice(-24), 루프: s.isLoop ? "Y" : "", 발효: s.firings, 응답: s.messages,
      입력: s.tokens.input, 출력: s.tokens.output, 캐시쓰기: s.tokens.cacheWrite5m + s.tokens.cacheWrite1h, 캐시읽기: s.tokens.cacheRead,
      비용USD: s.costUsd == null ? "단가 미설정" : s.costUsd.toFixed(4),
    })));
    console.table(rows);
  }
}
