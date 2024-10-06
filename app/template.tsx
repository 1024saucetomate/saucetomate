"use client";

import React, { useEffect } from "react";

export default function Template({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    const root = document.getElementById("smooth-transition-root");
    if (root) {
      root.classList.remove("ready");
    }
  }, []);

  return (
    <div id="smooth-transition-root" className="ready">
      {children}
    </div>
  );
}
