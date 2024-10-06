"use client";

import { useRouter } from "next/navigation";
import React from "react";

export default function Link({
  children,
  href,
  className,
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
}) {
  const router = useRouter();

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    document.getElementById("smooth-transition-root")?.classList.add("ready");
    setTimeout(() => {
      router.push(href);
    }, 500);
  }

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
