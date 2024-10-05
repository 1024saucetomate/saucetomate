"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Swipper from "@/components/Swipper";
import coreDataImport from "@/data/core.json";
import styles from "@/styles/app/core.module.css";

type PolicyType = {
  title: string;
  description: string;
  category: string;
  source: {
    name: string;
    url: string;
  };
};

type CandidateDataType = {
  policies: PolicyType[];
};

type CoreDataType = {
  [key: string]: CandidateDataType;
};

const coreData: CoreDataType = coreDataImport;

type RandomPolicyType = PolicyType & { candidate: string };

export default function Core() {
  const [randomPolicies, setRandomPolicies] = useState<RandomPolicyType[]>([]);
  const [cardsRemaining, setCardsRemaining] = useState<string | number>("--");

  useEffect(() => {
    const newRandomPolicies: RandomPolicyType[] = [];
    Object.entries(coreData).forEach(([candidate, candidateData]) => {
      if (Array.isArray(candidateData.policies)) {
        const randomCandidatePolicies = candidateData.policies
          .sort(() => Math.random() - 0.5)
          .slice(0, 10)
          .map((policy) => ({
            ...policy,
            candidate,
          }));
        newRandomPolicies.push(...randomCandidatePolicies);
      }
    });
    setRandomPolicies(newRandomPolicies);
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
        <small className={styles.container__swipper_remaining}>
          {`${cardsRemaining === 0 ? "Aucune" : cardsRemaining} ${
            cardsRemaining === 1 ? "proposition" : "propositions"
          } restante${cardsRemaining === 1 ? "" : "s"}`}
        </small>
        <Swipper
          policies={randomPolicies}
          className={styles.container__swipper_app}
          setCardsRemaining={setCardsRemaining}
        />
      </div>
    </div>
  );
}
