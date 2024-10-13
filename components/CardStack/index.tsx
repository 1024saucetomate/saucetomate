"use client";

import { useEffect, useState } from "react";
import Card from "react-tinder-card";

import styles from "@/styles/components/card-stack.module.css";
import MockAPI from "@/utils/MockAPI";

export default function CardStack({
  className,
  onPercentageUpdate,
}: {
  className?: string;
  onPercentageUpdate: (percentage: number) => void;
}) {
  const [policies, setPolicies] = useState([]);
  const [swipedPolicies, setSwipedPolicies] = useState<
    {
      id: string;
      validated: boolean;
    }[]
  >([]);

  function handleSwipe(policyId: string, direction: string) {
    const swipedPolicy = swipedPolicies.find((p) => p.id === policyId);
    if (swipedPolicy) {
      return;
    }
    setSwipedPolicies([...swipedPolicies, { id: policyId, validated: direction === "right" }]);
  }

  useEffect(() => {
    const candidates = MockAPI.get.candidates();
    setPolicies(MockAPI.get.policies.random(candidates.length * 10) as unknown as []);
  }, []);

  useEffect(() => {
    onPercentageUpdate((swipedPolicies.length / policies.length) * 100);
  }, [swipedPolicies, onPercentageUpdate, policies.length]);

  return (
    <div className={className}>
      <Card className={styles.card} key={"result"} preventSwipe={["up", "down", "left", "right"]}>
        <div key={"result"} className={styles.card__content}>
          <div className={styles.card__header} key={"result"}>
            <span>Vous avez fini</span>
            <h3>Le candidat qui vous correspond le plus est Donald Trump</h3>
          </div>
          <small>
            Si vous êtes d&apos;accord avec une proposition, glissez la carte vers la droite. Sinon, glissez la vers la
            gauche.
          </small>
        </div>
      </Card>

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
              <span>{policy.theme}</span>
              <h3>{policy.title}</h3>
            </div>
            <small>{policy.description}</small>
          </div>
        </Card>
      ))}

      <Card className={styles.card} key={""} preventSwipe={["up", "down"]} swipeRequirementType="position">
        <div key={"mode-emploi"} className={styles.card__content}>
          <div className={styles.card__header} key={"mode-emploi"}>
            <span>Mode d&apos;emploi</span>
            <h3>Faites glisser les cartes pour découvrir les propositions des candidats</h3>
          </div>
          <small>
            Si vous êtes d&apos;accord avec une proposition, glissez la carte vers la droite. Sinon, glissez la vers la
            gauche.
          </small>
        </div>
      </Card>
    </div>
  );
}
