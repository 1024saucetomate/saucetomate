"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Swipper from "@/components/Swipper";
import coreData from "@/data/core.json";
import styles from "@/styles/app/core.module.css";

export default function Core() {
  const [randomPolicies, setRandomPolicies] = useState<
    {
      category: string;
      title: string;
      description: string;
      candidate: string;
    }[]
  >([]);
  const [cardsRemaining, setCardsRemaining] = useState<string | number>("--");

  useEffect(() => {
    setRandomPolicies([]);
    Object.keys(coreData).forEach((candidate) => {
      const candidatePolicies = coreData[candidate].policies;
      const randomPolicies = candidatePolicies
        .sort(() => Math.random() - 0.5)
        .slice(0, 10);
      setRandomPolicies((prev) => [...prev, ...randomPolicies]);
    });
  }, []);

  useEffect(() => {
    setCardsRemaining(randomPolicies.length);
  }, [randomPolicies]);

  return (
    <div className={styles.container}>
      <Link href={"/"} className={styles.header}>
        <h3>{"Retour"}</h3>
      </Link>
      <div className={styles.container__swipper}>
        <small
          className={styles.container__swipper_remaining}
        >{`${cardsRemaining === 0 ? "Aucune" : cardsRemaining} ${cardsRemaining === 1 ? "proposition" : "propositions"} restante${cardsRemaining === 1 ? "" : "s"}`}</small>
        <Swipper
          policies={randomPolicies}
          className={styles.container__swipper_app}
          setCardsRemaining={setCardsRemaining}
        />
      </div>
    </div>
  );
}
