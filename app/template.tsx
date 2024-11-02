"use client";

import { useEffect, useRef } from "react";

import type { TemplateProps } from "@/utils/interfaces";

const Template: React.FC<TemplateProps> = ({ children }): JSX.Element => {
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
};

export default Template;
