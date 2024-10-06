"use client";
import { useEffect, useState } from "react";
import SwippableCard from "react-tinder-card";
import styles from "@/styles/components/swipper.module.css";

export default function Swipper({
  className,
  policies,
  setCardsRemaining,
}: {
  className?: string;
  policies: {
    category: string;
    title: string;
    description: string;
    candidate: string;
  }[];
  setCardsRemaining: any;
}) {
  const [candidateCount, setCandidateCount] = useState<{
    [key: string]: number;
  }>({});
  const [bestCandidate, setBestCandidate] = useState<string>("");

  function onCardLeftScreen(
    direction: string,
    policy: {
      category: string;
      title: string;
      description: string;
      candidate: string;
    },
  ) {
    setCardsRemaining((prev: number) => prev - 1);
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
  }

  useEffect(() => {
    const bestCandidate = Object.entries(candidateCount).reduce(
      (acc, [candidate, count]) => {
        if (Math.abs(count) > Math.abs(acc.count)) {
          return { candidate, count };
        }
        return acc;
      },
      { candidate: "", count: 0 },
    );
    setBestCandidate(bestCandidate.candidate);
  }, [candidateCount]);

  return (
    <div className={className}>
      <SwippableCard
        className={styles.card__container}
        preventSwipe={["up", "down", "right", "left"]}
        key={policies.length + 1}
        swipeRequirementType="position"
      >
        <div className={styles.card}>
          <p className={styles.card__content__category}>{"FIN"}</p>
          <h3 className={styles.card__content__title}>
            {"Vous avez fini de lire les propositions"}
          </h3>
          <small className={styles.card__content__date}>
            {`Le candidat qui vous correspond le mieux est ${bestCandidate}`}
          </small>
        </div>
      </SwippableCard>

      {policies.map((program, index) => (
        <SwippableCard
          className={styles.card__container}
          preventSwipe={["up", "down"]}
          key={index + 1}
          onCardLeftScreen={(direction) => onCardLeftScreen(direction, program)}
          swipeRequirementType="position"
        >
          <div
            className={styles.card}
            style={{ rotate: `${index % 2 === 0 ? -5 : 5}deg` }}
          >
            <p className={styles.card__content__category}>{program.category}</p>
            <h3 className={styles.card__content__title}>{program.title}</h3>
            <small className={styles.card__content__date}>
              {program.description}
            </small>
          </div>
        </SwippableCard>
      ))}

      <SwippableCard
        className={styles.card__container}
        preventSwipe={["up", "down"]}
        key={0}
        swipeRequirementType="position"
      >
        <div className={styles.card}>
          <p className={styles.card__content__category}>{"MODE D'EMPLOI"}</p>
          <h3 className={styles.card__content__title}>
            {"Faites glisser les propositions pour les lire"}
          </h3>
          <p className={styles.card__content__date}>
            {
              "Si vous êtes d'accord, glissez la carte vers la droite. Sinon, glissez la carte vers la gauche"
            }
          </p>
        </div>
      </SwippableCard>
    </div>
  );
}
