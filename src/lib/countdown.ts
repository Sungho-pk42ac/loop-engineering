const pad = (n: number) => String(n).padStart(2, "0");

// 남은 밀리초 → `종료까지 N일 HH:MM:SS 남음`. 0 이하이면 `기획전 종료`.
export function formatCountdown(remainingMs: number): string {
  if (remainingMs <= 0) return "기획전 종료";
  const totalSeconds = Math.floor(remainingMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `종료까지 ${days}일 ${pad(hours)}:${pad(minutes)}:${pad(seconds)} 남음`;
}
