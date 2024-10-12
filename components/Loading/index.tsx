"use client";

import { useEffect, useRef } from "react";

import styles from "@/styles/components/loading.module.css";

export default function Loading() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      setTimeout(() => {
        container.style.opacity = "0";
        setTimeout(() => {
          container.style.display = "none";
        }, 500);
      }, 1000);
    }
  }, []);

  return (
    <div className={styles.container} ref={containerRef}>
      <h1>SAUCETOMATE</h1>
    </div>
  );
}
