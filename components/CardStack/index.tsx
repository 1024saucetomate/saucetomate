"use client";

import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { useCallback, useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import Card from "react-tinder-card";

import styles from "@/styles/components/card-stack.module.css";
import MockAPI from "@/utils/MockAPI";

ChartJS.register(ArcElement, Tooltip, Legend);

type Policy = {
  id: string;
  theme: string;
  title: string;
  description: string;
  candidateId: string;
};

type SwipedPolicy = {
  id: string;
  validated: boolean;
};

type PeerSwipe = {
  candidateId: string;
  count: number;
};

type CardStackProps = {
  className?: string;
  onPercentageUpdate: (percentage: number) => void;
};

export default function CardStack({ className, onPercentageUpdate }: CardStackProps) {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [swipedPolicies, setSwipedPolicies] = useState<SwipedPolicy[]>([]);
  const [bestCandidate, setBestCandidate] = useState<string | null>(null);
  const [peerSwipes, setPeerSwipes] = useState<PeerSwipe[]>([]);

  const handleSwipe = useCallback((policyId: string, direction: string) => {
    setSwipedPolicies((prev) => {
      if (prev.some((p) => p.id === policyId)) return prev;
      return [...prev, { id: policyId, validated: direction === "right" }];
    });
  }, []);

  useEffect(() => {
    const candidates = MockAPI.get.candidates.all();
    setPolicies(MockAPI.get.policies.random(candidates.length * 10) as Policy[]);
  }, []);

  useEffect(() => {
    onPercentageUpdate((swipedPolicies.length / policies.length) * 100);
  }, [swipedPolicies.length, policies.length, onPercentageUpdate]);

  useEffect(() => {
    const candidatesCount = swipedPolicies.reduce(
      (acc, { id, validated }) => {
        if (validated) {
          const policy = policies.find((p) => p.id === id);
          if (policy) {
            acc[policy.candidateId] = (acc[policy.candidateId] || 0) + 1;
          }
        }
        return acc;
      },
      {} as Record<string, number>,
    );

    if (Object.keys(candidatesCount).length === 0) return;

    const bestCandidateId = Object.entries(candidatesCount).reduce((a, b) => (a[1] > b[1] ? a : b))[0];

    if (swipedPolicies.length === policies.length) {
      fetch("/api/swipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidateId: bestCandidateId }),
      }).then(() => {
        setPeerSwipes((prev) =>
          prev.map((swipe) => (swipe.candidateId === bestCandidateId ? { ...swipe, count: swipe.count + 1 } : swipe)),
        );
      });
    }

    setBestCandidate(MockAPI.get.candidates.id(bestCandidateId)?.profile.name || null);
  }, [swipedPolicies, policies]);

  useEffect(() => {
    fetch("/api/swipe")
      .then((res) => res.json())
      .then(setPeerSwipes);
  }, []);

  const renderResultCard = () => (
    <Card className={styles.card} preventSwipe={["up", "down", "left", "right"]}>
      <div className={styles.card__content}>
        <div className={styles.card__header}>
          <span className={styles.card__header__theme}>Vous avez fini</span>
          <h3 className={styles.card__header__title}>
            {`D'après vos choix, ${bestCandidate} est le candidat qui vous correspond le plus`}
          </h3>
        </div>
        <small className={styles.card__description}>Consultez les résultats des autres utilisateurs</small>
        <Doughnut
          data={{
            labels: peerSwipes.map((swipe) => MockAPI.get.candidates.id(swipe.candidateId)?.profile.name),
            datasets: [
              {
                data: peerSwipes.map((swipe) => Math.max(swipe.count || 1, 1)),
                backgroundColor: peerSwipes.map(
                  (_, index) => `rgba(255, 0, 0, ${0.1 + (index / peerSwipes.length) * 0.9})`,
                ),
              },
            ],
          }}
          className={styles.card__stats}
        />
      </div>
    </Card>
  );

  const renderPolicyCards = () =>
    policies.map((policy, index) => (
      <Card
        className={styles.card}
        key={policy.id}
        preventSwipe={["up", "down"]}
        onSwipe={(direction) => handleSwipe(policy.id, direction)}
      >
        <div className={styles.card__content} style={{ transform: `rotate(${index % 2 === 0 ? 5 : -5}deg)` }}>
          <div className={styles.card__header}>
            <span className={styles.card__header__theme}>{policy.theme}</span>
            <h3 className={styles.card__header__title}>{policy.title}</h3>
          </div>
          <small className={styles.card__description}>{policy.description}</small>
        </div>
      </Card>
    ));

  const renderInstructionCard = () => (
    <Card className={styles.card} preventSwipe={["up", "down"]} swipeRequirementType="position">
      <div className={styles.card__content}>
        <div className={styles.card__header}>
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
  );

  return (
    <div className={className}>
      {swipedPolicies.length === policies.length ? (
        renderResultCard()
      ) : (
        <Card className={styles.card} preventSwipe={["up", "down", "left", "right"]}>
          <div className={styles.card__content}>
            <h3 className={styles.card__header__title}>
              Continuez à swiper pour découvrir le candidat qui vous correspond le plus
            </h3>
          </div>
        </Card>
      )}
      {renderPolicyCards()}
      {renderInstructionCard()}
    </div>
  );
}
