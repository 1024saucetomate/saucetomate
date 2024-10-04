"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/components/splashscreen.module.css";

export default function SplashScreen() {
  const [opacity, setOpacity] = useState(1);
  const [display, setDisplay] = useState("block");

  useEffect(() => {
    setTimeout(() => {
      setOpacity(0);
      setTimeout(() => {
        setDisplay("none");
      }, 500);
    }, 1000);
  }, []);

  return (
    <div className={styles.container} style={{ opacity, display }}>
      <h3>{"SAUCETOMATE"}</h3>
    </div>
  );
}
