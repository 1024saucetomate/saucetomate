"use client";

import { useEffect, useRef } from "react";

import styles from "@/styles/components/loading.module.css";
import type { LoadingProps } from "@/utils/interfaces";

const Loading: React.FC<LoadingProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const hideTimeout = setTimeout(() => {
      container.style.opacity = "0";

      const removeTimeout = setTimeout(() => {
        container.style.display = "none";
      }, 500);

      return () => clearTimeout(removeTimeout);
    }, 1000);

    return () => clearTimeout(hideTimeout);
  }, []);

  return (
    <div className={styles.container} ref={containerRef}>
      <h3>SAUCETOMATE</h3>
    </div>
  );
};

export default Loading;
