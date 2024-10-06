"use client";
import { useEffect, useState } from "react";
import SwippableCard from "react-tinder-card";
import styles from "@/styles/components/swipper.module.css";

export default function Swipper({
  className,
  policies,
  setCardsRemaining,
}: Readonly<{
  className?: string;
  policies: {
    category: string;
    title: string;
    description: string;
    candidate: string;
  }[];
  setCardsRemaining: any;
}>) {
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
          <p className={styles.card__content__category}>{"Fin"}</p>
          <h3 className={styles.card__content__title}>
            {`Le candidat qui vous correspond le mieux est ${bestCandidate}`}
          </h3>
          <small className={styles.card__content__description}>
            {bestCandidate === "Donald Trump"
              ? "Donald Trump prône l'« Amérique d'abord » avec des politiques protectionnistes, réductions d'impôts et déréglementation. Il est contre l'immigration illégale et soutient une politique énergétique axée sur les énergies fossiles. Sur les questions sociales, il est conservateur, s'opposant à l'avortement et aux droits LGBTQ+."
              : "Kamala Harris défend des politiques progressistes, axées sur la justice sociale, l'égalité raciale et les droits des femmes. Elle soutient une réforme de la police, une couverture santé élargie, et des politiques climatiques fortes. Harris est favorable aux droits LGBTQ+, au droit à l'avortement, et à une immigration plus humaine."}
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
            <small className={styles.card__content__description}>
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
