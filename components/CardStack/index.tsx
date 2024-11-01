"use client";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { TailSpin } from "react-loader-spinner";
import Card from "react-tinder-card";

import styles from "@/styles/components/card-stack.module.css";
import MockAPI from "@/utils/MockAPI";

import Link from "../Link";

const TOAST_STYLE = {
  border: "5px solid var(--color-black)",
  color: "var(--color-black)",
  background: "var(--color-white)",
  fontFamily: "var(--font-family)",
  fontWeight: "var(--font-weight)",
  borderRadius: "0",
  width: "90dvw",
  maxWidth: "350px",
};

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
  const [gifs, setGifs] = useState<
    | {
        url: string;
        alt: string;
        candidateId?: string;
      }[]
    | null
  >(null);
  const [voteId, setVoteId] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  const handleSwipe = useCallback((policyId: string, direction: string) => {
    setSwipedPolicies((prev) => {
      if (prev.some((p) => p.id === policyId)) return prev;
      return [...prev, { id: policyId, isFor: direction === "right" }];
    });
  }, []);

  useEffect(() => {
    const candidates = MockAPI.get.candidates.all();
    setPolicies(
      MockAPI.get.policies.random(
        candidates.length * parseInt(process.env.NEXT_PUBLIC_POLICIES_PER_CANDIDATE as string),
      ) as {
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
  }, [swipedPolicies.length, policies.length, onPercentageUpdate]);

  useEffect(() => {
    const isComplete = policies.length !== 0 && swipedPolicies.length === policies.length;
    if (!isComplete) return;

    async function saveVotes() {
      return axios
        .post("/api/save", swipedPolicies)
        .then((response) => {
          setVoteId(response.data.data.voteId);
        })
        .catch((error) => {
          setHasError(true);
          throw new Error(error);
        });
    }

    toast.promise(
      saveVotes(),
      {
        loading: "Sauvegarde de votre vote...",
        success: "Votre vote a été sauvegardé",
        error: "Impossible de sauvegarder votre vote. Veuillez réessayer plus tard.",
      },
      {
        style: TOAST_STYLE,
      },
    );
  }, [swipedPolicies, policies]);

  useEffect(() => {
    const bestCandidateId = MockAPI.get.score.compute(swipedPolicies);
    if (!bestCandidateId) return;
    const candidate = MockAPI.get.candidates.fromId(bestCandidateId)?.profile;
    if (!candidate) return;
    setBestCandidate({
      id: bestCandidateId,
      name: candidate.name,
      slogan: candidate.slogan,
      sex: candidate.sex,
    });
  }, [swipedPolicies, policies]);

  useEffect(() => {
    const loadGifs = () => {
      const candidates = MockAPI.get.candidates.all();
      const newGifs = candidates.map((candidate) => ({
        url: MockAPI.get.candidates.randomGIF(candidate.id) || "",
        alt: `GIF de ${candidate.profile.name}`,
        candidateId: candidate.id,
      }));
      setGifs(newGifs);
    };

    loadGifs();
  }, []);

  const renderResultCard = () => (
    <div className={styles.card} key="result-container">
      <div className={styles.card__content}>
        <div className={styles.card__header}>
          <span className={styles.card__header__theme}>{bestCandidate?.slogan}</span>
          <h3 className={styles.card__header__title}>
            {`${bestCandidate?.name} semble être ${bestCandidate?.sex === "M" ? "le candidat" : "la candidate"} qui vous correspond le plus`}
          </h3>
        </div>
        <div className={styles.card__gifs__container}>
          {gifs?.map((gif, index) => (
            <div
              key={index}
              aria-label={gif.alt || "Une erreur est survenue"}
              style={{
                backgroundImage: `url(${gif.url})`,
                display:
                  swipedPolicies.length !== policies.length || gif.candidateId === bestCandidate?.id ? "block" : "none",
              }}
              className={styles.card__gif}
              draggable={false}
            />
          ))}
        </div>
        {!hasError && renderActionButton()}
      </div>
    </div>
  );

  const renderActionButton = () => {
    if (voteId) {
      return (
        <Link href={`/vote/${voteId}`} className={styles.card__button__container}>
          <button className={styles.card__button}>{`Analyser mon vote`}</button>
        </Link>
      );
    }
    return (
      <button className={styles.card__button} disabled>
        <TailSpin width={20} height={20} strokeWidth={7} />
      </button>
    );
  };

  const renderLoaderCard = () => (
    <div
      className={styles.card}
      key="result-container-loader"
      style={{ display: swipedPolicies.length === policies.length ? "none" : "block" }}
    >
      <div className={styles.card__content}>
        <h3 className={styles.card__header__title}>
          Continuez à swiper pour découvrir le candidat qui vous correspond le plus
        </h3>
      </div>
    </div>
  );

  const renderPolicyCards = () =>
    policies.map((policy, index) => (
      <Card
        key={policy.id}
        className={styles.card}
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
    <Card className={styles.card} key="instructions" preventSwipe={["up", "down"]} swipeRequirementType="position">
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
      {renderResultCard()}
      {renderLoaderCard()}
      {renderPolicyCards()}
      {renderInstructionCard()}
    </div>
  );
}
