"use client";

import { useEffect, useState } from "react";
import Card from "react-tinder-card";

import styles from "@/styles/components/card-stack.module.css";
import MockAPI from "@/utils/MockAPI";
import rtb64 from "@/utils/resultToBase64";

import Link from "../Link";

export default function CardStack({
  className,
  onPercentageUpdate,
}: {
  className?: string;
  onPercentageUpdate: (percentage: number) => void;
}) {
  const [policies, setPolicies] = useState<
    {
      id: string;
      theme: string;
      title: string;
      description: string;
    }[]
  >([]);
  const [swipedPolicies, setSwipedPolicies] = useState<
    {
      id: string;
      validated: boolean;
    }[]
  >([]);
  const [resultToBase64, setResultToBase64] = useState<string>("");

  function handleSwipe(policyId: string, direction: string) {
    const swipedPolicy = swipedPolicies.find((p) => p.id === policyId);
    if (swipedPolicy) {
      return;
    }
    setSwipedPolicies([...swipedPolicies, { id: policyId, validated: direction === "right" }]);
  }

  useEffect(() => {
    const candidates = MockAPI.get.candidates();
    setPolicies(
      MockAPI.get.policies.random(candidates.length * 10) as {
        id: string;
        theme: string;
        title: string;
        description: string;
      }[],
    );
  }, []);

  useEffect(() => {
    onPercentageUpdate((swipedPolicies.length / policies.length) * 100);
  }, [swipedPolicies, onPercentageUpdate, policies.length]);

  useEffect(() => {
    setResultToBase64(rtb64(swipedPolicies));
  }, [swipedPolicies]);

  return (
    <div className={className}>
      <div className={styles.card} key={"result-container"}>
        <div key={"result"} className={styles.card__content}>
          <div className={styles.card__header} key={"result"}>
            <span className={styles.card__header__theme}>Vous avez fini</span>
            <h3 className={styles.card__header__title}>
              D&apos;après vos choix,{" "}
              <span className={styles.card__header__title__masked}>
                {MockAPI.get.candidates()[Math.floor(Math.random() * MockAPI.get.candidates().length)].profile.name}
              </span>{" "}
              est le candidat qui vous correspond le plus
            </h3>
          </div>
          <Link href={`/swipe/result?data=${resultToBase64}`}>
            <button>
              <h3>Afficher mes résultats</h3>
            </button>
          </Link>
        </div>
      </div>

      {policies.map((policy: { id: string; theme: string; title: string; description: string }, index: number) => (
        <Card
          className={styles.card}
          key={policy.id}
          preventSwipe={["up", "down"]}
          onSwipe={(direction) => handleSwipe(policy.id, direction)}
        >
          <div
            key={policy.id}
            className={styles.card__content}
            style={{ transform: `rotate(${index % 2 === 0 ? 5 : -5}deg)` }}
          >
            <div className={styles.card__header}>
              <span className={styles.card__header__theme}>{policy.theme}</span>
              <h3 className={styles.card__header__title}>{policy.title}</h3>
            </div>
            <small className={styles.card__description}>{policy.description}</small>
          </div>
        </Card>
      ))}

      <Card className={styles.card} key={""} preventSwipe={["up", "down"]} swipeRequirementType="position">
        <div key={"mode-emploi"} className={styles.card__content}>
          <div className={styles.card__header} key={"mode-emploi"}>
            <span className={styles.card__header__theme}>Mode d&apos;emploi</span>
            <h3 className={styles.card__header__title}>
              Faites glisser les cartes pour découvrir les propositions des candidats
            </h3>
          </div>
          <small className={styles.card__description}>
            Si vous êtes d&apos;accord avec une proposition, glissez la carte vers la droite. Sinon, glissez la vers la
            gauche.
          </small>
        </div>
      </Card>
    </div>
  );
}
