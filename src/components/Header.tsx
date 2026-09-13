import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-sticky border-b border-line bg-surface">
      <div className="mx-auto flex h-14 max-w-page items-center px-4 md:px-6">
        <Link href="/products" className="text-title-sm font-bold text-ink">
          패캠 스토어
        </Link>
      </div>
    </header>
  );
}
