"use client";

import { useState } from "react";
import SlotCounter from "react-slot-counter";

import CardStack from "@/components/CardStack";
import Link from "@/components/Link";
import styles from "@/styles/app/swipe.module.css";
import type { SwipeProps } from "@/utils/interfaces";

const Swipe: React.FC<SwipeProps> = () => {
  const [percentage, setPercentage] = useState<number>(0);

  const handlePercentageUpdate = (newPercentage: number): void => {
    setPercentage(newPercentage);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/">
          <h3>Retour</h3>
        </Link>
        <h3 className={styles.header__percentage}>
          <SlotCounter value={Math.round(percentage) || 0} duration={0.5} startValue={0} /> <span>%</span>
        </h3>
      </div>
      <div className={styles.stack__container}>
        <CardStack className={styles.stack} onPercentageUpdate={handlePercentageUpdate} />
      </div>
    </div>
  );
};

export default Swipe;
