"use client";

import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import Card from "react-tinder-card";

import styles from "@/styles/components/card-stack.module.css";
import MockAPI from "@/utils/MockAPI";

ChartJS.register(ArcElement, Tooltip, Legend);

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
      candidateId: string;
    }[]
  >([]);
  const [swipedPolicies, setSwipedPolicies] = useState<
    {
      id: string;
      validated: boolean;
    }[]
  >([]);
  const [bestCandidate, setBestCandidate] = useState<string | null>(null);

  function handleSwipe(policyId: string, direction: string) {
    const swipedPolicy = swipedPolicies.find((p) => p.id === policyId);
    if (swipedPolicy) {
      return;
    }
    setSwipedPolicies([...swipedPolicies, { id: policyId, validated: direction === "right" }]);
  }

  useEffect(() => {
    const candidates = MockAPI.get.candidates.all();
    setPolicies(
      MockAPI.get.policies.random(candidates.length * 2) as {
        id: string;
        theme: string;
        title: string;
        description: string;
        candidateId: string;
      }[],
    );
  }, []);

  useEffect(() => {
    onPercentageUpdate((swipedPolicies.length / policies.length) * 100);
  }, [swipedPolicies, onPercentageUpdate, policies.length]);

  useEffect(() => {
    const candidatesCount: { [key: string]: number } = {};
    policies.forEach((policy) => {
      if (swipedPolicies.find((p) => p.id === policy.id && p.validated)) {
        if (!candidatesCount[policy.candidateId]) {
          candidatesCount[policy.candidateId] = 0;
        }
        candidatesCount[policy.candidateId]++;
      }
    });

    if (Object.keys(candidatesCount).length === 0) return;

    const bestCandidateId = Object.keys(candidatesCount).reduce((a, b) =>
      candidatesCount[a] > candidatesCount[b] ? a : b,
    );

    setBestCandidate(MockAPI.get.candidates.id(bestCandidateId)?.profile.name as string);
  }, [swipedPolicies]);

  return (
    <div className={className}>
      <Card className={styles.card} key={"result-container"} preventSwipe={["up", "down", "left", "right"]}>
        <div key={"result"} className={styles.card__content}>
          {(swipedPolicies.length === policies.length && (
            <>
              <div className={styles.card__header} key={"result"}>
                <span className={styles.card__header__theme}>Vous avez fini</span>
                <h3 className={styles.card__header__title}>
                  {`D'après vos choix, ${bestCandidate} est le candidat qui vous correspond le plus`}
                </h3>
              </div>
              <small className={styles.card__description}>{`Consultez les résultats des autres utilisateurs`}</small>
              <Doughnut
                data={{
                  // TODO: Use real data
                  labels: ["Kamala Harris", "Donald Trump"],
                  datasets: [
                    {
                      data: [70, 30],
                      backgroundColor: ["#FF6384", "#36A2EB"],
                      hoverBackgroundColor: ["#FF6384", "#36A2EB"],
                    },
                  ],
                }}
                className={styles.card__stats}
              />
            </>
          )) || (
            <h3 className={styles.card__header__title}>
              {`Continuez à swiper pour découvrir le candidat qui vous correspond le plus`}
            </h3>
          )}
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
