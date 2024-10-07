"use client";

import React, { useEffect, useState } from "react";

import SwippableCard from "react-tinder-card";
import coreDataImport from "@/data/core.json";
import styles from "@/styles/components/swipper.module.css";

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

interface SwipperProps {
  className?: string;
  policies: {
    category: string;
    title: string;
    description: string;
    candidate: string;
  }[];
  cardsRemaining: number;
  setCardsRemaining: React.Dispatch<React.SetStateAction<number>>;
  setBestCandidate: React.Dispatch<React.SetStateAction<string>>;
}

export default function Swipper({
  className,
  policies,
  cardsRemaining,
  setCardsRemaining,
  setBestCandidate: setBestCandidateProp,
}: SwipperProps) {
  const [candidateCount, setCandidateCount] = useState<{
    [key: string]: number;
  }>({});
  const [bestCandidate, setBestCandidate] = useState<string>("");
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [cardsSwiped, setCardsSwiped] = useState<string[]>([]);

  const handleSwipe = (
    direction: string,
    policy: {
      category: string;
      title: string;
      description: string;
      candidate: string;
    },
    index: number,
  ) => {
    if (cardsSwiped.includes(policy.title + index)) {
      return;
    }
    setCardsSwiped((prev) => [...prev, policy.title + index]);
    setCardsRemaining((prev) => prev - 1);
    switch (direction) {
      case "left":
        setCandidateCount((prev) => ({
          ...prev,
          [policy.candidate]: (prev[policy.candidate] || 0) - 1,
        }));
        break;
      case "right":
        setCandidateCount((prev) => ({
          ...prev,
          [policy.candidate]: (prev[policy.candidate] || 0) + 1,
        }));
        break;
    }
  };

  useEffect(() => {
    const bestCandidate =
      Object.entries(candidateCount).sort(
        (a, b) => Math.abs(b[1]) - Math.abs(a[1]),
      )[0]?.[0] || "";
    setBestCandidateProp(bestCandidate);
  }, [candidateCount, setBestCandidate]);

  useEffect(() => {
    if (cardsRemaining === 0) {
      setIsFinished(true);
    }
  }, [cardsRemaining]);

  const reversedPolicies = [...policies].reverse();

  return (
    <div className={className}>
      {isFinished && (
        <SwippableCard
          className={styles.card__container}
          preventSwipe={["up", "down", "right", "left"]}
          key="end"
          swipeRequirementType="position"
        >
          <div className={styles.card}>
            <p className={styles.card__content__category}>{"Fin"}</p>
            <h3 className={styles.card__content__title}>
              {`Le candidat qui vous correspond le mieux est ${bestCandidate}`}
            </h3>
            <small className={styles.card__content__description}>
              {bestCandidate ? coreData[bestCandidate].description : ""}
            </small>
          </div>
        </SwippableCard>
      )}

      {reversedPolicies.map((program, index) => (
        <SwippableCard
          className={styles.card__container}
          preventSwipe={["up", "down"]}
          key={program.title + index}
          onSwipe={(direction) => handleSwipe(direction, program, index)}
          swipeRequirementType="position"
        >
          <div
            className={styles.card}
            style={{ rotate: `${index % 2 === 0 ? -5 : 5}deg` }}
          >
            <p className={styles.card__content__category}>{program.category}</p>
            <h3 className={styles.card__content__title}>{program.title}</h3>
            <small className={styles.card__content__description}>
              {program.description}
            </small>
          </div>
        </SwippableCard>
      ))}

      <SwippableCard
        className={styles.card__container}
        preventSwipe={["up", "down"]}
        key="instructions"
        swipeRequirementType="position"
      >
        <div className={styles.card}>
          <p className={styles.card__content__category}>{"MODE D'EMPLOI"}</p>
          <h3 className={styles.card__content__title}>
            {"Faites glisser les propositions pour les lire"}
          </h3>
          <p className={styles.card__content__description}>
            {
              "Si vous êtes d'accord, glissez la carte vers la droite. Sinon, glissez la carte vers la gauche"
            }
          </p>
        </div>
      </SwippableCard>
    </div>
  );
}
