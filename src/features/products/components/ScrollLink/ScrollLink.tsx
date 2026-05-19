"use client";

import type { MouseEvent, ReactNode } from "react";

type ScrollLinkProps = {
  targetId: string;
  className?: string;
  children: ReactNode;
};

export function ScrollLink({ targetId, className, children }: ScrollLinkProps) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document
      .getElementById(targetId)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <a href={`#${targetId}`} className={className} onClick={handleClick}>
      {children}
    </a>
  );
}
