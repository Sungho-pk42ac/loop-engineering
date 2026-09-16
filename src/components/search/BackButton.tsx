"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

export function BackButton({ className, children }: { className: string; children: ReactNode }) {
  const router = useRouter();
  return (
    <button type="button" aria-label="뒤로" onClick={() => router.back()} className={className}>
      {children}
    </button>
  );
}
