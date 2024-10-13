"use client";

import { useEffect, useRef } from "react";

export default function Template({ children }: Readonly<{ children: React.ReactNode }>) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = containerRef.current;
    container?.classList.remove("hidden");
  }, []);
  return (
    <div id="smooth-transition-container" className="hidden" ref={containerRef}>
      {children}
    </div>
  );
}
