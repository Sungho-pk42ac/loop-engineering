import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "accent" | "ghost";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClass: Record<Variant, string> = {
  primary: "bg-brand text-ink-inverse hover:bg-brand-hover",
  secondary: "border border-line bg-surface text-ink hover:bg-surface-subtle",
  accent: "bg-accent text-ink-inverse hover:bg-accent-hover",
  ghost: "text-ink hover:bg-surface-subtle",
};

const sizeClass: Record<Size, string> = {
  sm: "h-8 px-3 text-label rounded-sm",
  md: "h-10 px-4 text-label rounded-md",
  lg: "h-12 px-6 text-body font-semibold rounded-md",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-1 font-medium transition-colors disabled:bg-surface-muted disabled:text-ink-disabled disabled:cursor-not-allowed ${variantClass[variant]} ${sizeClass[size]} ${className}`}
      {...props}
    />
  );
}
