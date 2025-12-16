"use client";

import Link from "next/link";
import type { ReactNode } from "react";

export function KbTooltipLink({
  href,
  title,
  hint,
  children,
}: {
  href: string;
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  if (!hint) return <Link href={href}>{children}</Link>;

  return (
    <span className="kb-tooltip">
      <Link className="kb-tooltip-link" href={href}>
        {children}
      </Link>
      <span className="kb-tooltip-bubble" role="tooltip">
        <span className="kb-tooltip-title">{title}</span>
        <span className="kb-tooltip-hint">{hint}</span>
      </span>
    </span>
  );
}

