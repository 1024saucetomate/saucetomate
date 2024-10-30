"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
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
      isFor: boolean;
    }[]
  >([]);
  const [bestCandidate, setBestCandidate] = useState<{
    id: string;
    name: string;
    slogan: string;
    sex: string;
  } | null>(null);
  const [gif, setGif] = useState<{
    url: string;
    alt: string;
  } | null>(null);
  const [voteId, setVoteId] = useState<string | null>(null);
  const [hasError, setHasError] = useState<boolean>(false);

  function handleSwipe(policyId: string, direction: string) {
    const swipedPolicy = swipedPolicies.find((p) => p.id === policyId);
    if (swipedPolicy) {
      return;
    }
    setSwipedPolicies([...swipedPolicies, { id: policyId, isFor: direction === "right" }]);
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
    if (policies.length !== 0 && swipedPolicies.length === policies.length) {
      const res = axios.post("/api/save", swipedPolicies);
      res
        .then((data) => {
          setVoteId(data.data.data.voteId);
        })
        .catch(() => {
          setHasError(true);
          toast.error("Impossible de sauvegarder votre vote. Veuillez réessayer plus tard.", {
            style: {
              border: "5px solid var(--color-black)",
              color: "var(--color-black)",
              background: "var(--color-white)",
              fontFamily: "var(--font-family)",
              fontWeight: "var(--font-weight)",
              borderRadius: "0",
              width: "90dvw",
              maxWidth: "350px",
            },
          });
        });
    }
  }, [swipedPolicies, policies.length, onPercentageUpdate]);

  useEffect(() => {
    const candidatesCount: { [key: string]: number } = {};
    policies.forEach((policy) => {
      if (swipedPolicies.find((p) => p.id === policy.id && p.isFor)) {
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

    setBestCandidate({
      id: bestCandidateId,
      name: MockAPI.get.candidates.fromId(bestCandidateId)?.profile.name as string,
      slogan: MockAPI.get.candidates.fromId(bestCandidateId)?.profile.slogan as string,
      sex: MockAPI.get.candidates.fromId(bestCandidateId)?.profile.sex as string,
    });
  }, [swipedPolicies, policies]);

  useEffect(() => {
    if (bestCandidate) {
      const bestCandidateId = MockAPI.get.candidates
        .all()
        .find((candidate) => candidate.profile.name === bestCandidate.name);

      const gifURL = MockAPI.get.candidates.randomGIF(bestCandidateId?.id as string);
      if (gifURL) {
        setGif({
          url: gifURL,
          alt: `GIF de ${bestCandidate.name}`,
        });
      }
    }
  }, [bestCandidate]);

  return (
    <div className={className}>
      <div className={styles.card} key={"result-container"}>
        <div key={"result"} className={styles.card__content}>
          {(swipedPolicies.length === policies.length && (
            <>
              <div className={styles.card__header} key={"result"}>
                <span className={styles.card__header__theme}>{bestCandidate?.slogan}</span>
                <h3 className={styles.card__header__title}>
                  {`${bestCandidate?.name} semble être ${bestCandidate?.sex === "M" ? "le candidat" : "la candidate"} qui vous correspond le plus`}
                </h3>
              </div>
              <div
                aria-label={gif?.alt || "Une erreur est survenue"}
                style={{
                  backgroundImage: `url(${gif?.url})`,
                }}
                className={styles.card__image}
                draggable={false}
              />
              {!hasError && (
                <button
                  className={styles.card__button}
                  disabled={!voteId}
                >{`Pourquoi ${bestCandidate?.sex === "M" ? "lui" : "elle"} ?`}</button>
              )}
            </>
          )) || (
            <h3 className={styles.card__header__title}>
              {`Continuez à swiper pour découvrir le candidat qui vous correspond le plus`}
            </h3>
          )}
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
