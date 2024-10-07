"use client";

import { useEffect, useState } from "react";

import SlotCounter from "react-slot-counter";
import Link from "@/components/Link";
import MatterEndingScene from "@/components/MatterEndingScene";
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
  description: string;
  policies: PolicyType[];
};

type CoreDataType = {
  [key: string]: CandidateDataType;
};

const coreData: CoreDataType = coreDataImport;

type RandomPolicyType = PolicyType & { candidate: string };

export default function Core() {
  const [randomPolicies, setRandomPolicies] = useState<RandomPolicyType[]>([]);
  const [cardsRemaining, setCardsRemaining] = useState<number>(0);
  const [bestCandidate, setBestCandidate] = useState<string>("");
  const [showEndingScene, setShowEndingScene] = useState<boolean>(false);

  useEffect(() => {
    const newRandomPolicies: RandomPolicyType[] = [];
    Object.entries(coreData).forEach(([candidate, candidateData]) => {
      if (Array.isArray(candidateData.policies)) {
        const randomCandidatePolicies = candidateData.policies
          .toSorted(() => Math.random() - 0.5)
          .slice(0, 10)
          .map((policy) => ({
            ...policy,
            candidate,
          }));
        newRandomPolicies.push(...randomCandidatePolicies);
      }
    });

    const candidates = Object.keys(coreData);
    if (candidates.length > 0) {
      const randomCandidate =
        candidates[Math.floor(Math.random() * candidates.length)];
      const extraPolicy = coreData[randomCandidate].policies
        .toSorted(() => Math.random() - 0.5)
        .slice(0, 1)
        .map((policy) => ({
          ...policy,
          candidate: randomCandidate,
        }));
      newRandomPolicies.push(...extraPolicy);
    }

    setRandomPolicies(newRandomPolicies.toSorted(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    setCardsRemaining(randomPolicies.length);
  }, [randomPolicies]);

  useEffect(() => {
    if (cardsRemaining === 0 && bestCandidate) {
      const timer = setTimeout(() => {
        setShowEndingScene(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [cardsRemaining, bestCandidate]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.container__header}>
          <h3>
            <Link href={"/"} className={styles.container__header_link}>
              {"Retour"}
            </Link>
          </h3>
          <span className={styles.container__header_counter}>
            <SlotCounter
              value={Math.round(
                ((randomPolicies.length - cardsRemaining) /
                  randomPolicies.length) *
                  100,
              )}
              duration={0.5}
              charClassName={styles.container__header_counter_char}
            />
            <span>%</span>
          </span>
        </div>
        <div className={styles.container__swipper}>
          <Swipper
            policies={randomPolicies}
            className={styles.container__swipper_app}
            cardsRemaining={cardsRemaining}
            setCardsRemaining={setCardsRemaining}
            setBestCandidate={setBestCandidate}
          />
        </div>
      </div>
      {showEndingScene && (
        <MatterEndingScene
          className={styles.matter_scene}
          candidate={bestCandidate as "Donald Trump" | "Kamala Harris"}
          start={true}
        />
      )}
    </>
  );
}
