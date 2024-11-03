"use client";

import axios from "axios";
import Drawer from "rc-drawer";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { TailSpin } from "react-loader-spinner";
import Card from "react-tinder-card";

import styles from "@/styles/components/card-stack.module.css";
import type { BestCandidate, CardStackProps, DrawerContent, Gif, Policy, SwipedPolicy } from "@/utils/interfaces";
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

const CardStack = ({ className, onPercentageUpdate }: CardStackProps): JSX.Element => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [swipedPolicies, setSwipedPolicies] = useState<SwipedPolicy[]>([]);
  const [bestCandidate, setBestCandidate] = useState<BestCandidate | null>(null);
  const [gifs, setGifs] = useState<Gif[] | null>(null);
  const [voteId, setVoteId] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState<DrawerContent>({
    title: "",
    description: "",
  });

  const handleSwipe = useCallback((policyId: string, direction: string) => {
    setSwipedPolicies((prev) => {
      if (prev.some((p) => p.id === policyId)) return prev;
      return [...prev, { id: policyId, isFor: direction === "right" }];
    });
  }, []);

  const loadInitialPolicies = useCallback(() => {
    const candidates = MockAPI.get.candidates.all();
    const policiesPerCandidate = parseInt(process.env.NEXT_PUBLIC_POLICIES_PER_CANDIDATE as string);
    setPolicies(MockAPI.get.policies.random(candidates.length * policiesPerCandidate) as Policy[]);
  }, []);

  const loadGifs = useCallback(() => {
    const candidates = MockAPI.get.candidates.all();
    const newGifs = candidates.map((candidate) => ({
      url: MockAPI.get.candidates.randomGIF(candidate.id) || "",
      alt: `GIF de ${candidate.profile.name}`,
      candidateId: candidate.id,
    }));
    setGifs(newGifs);
  }, []);

  const saveVotes = useCallback(async () => {
    try {
      const response = await axios.post("/api/save", swipedPolicies);
      setVoteId(response.data.data.voteId);
    } catch (error) {
      setHasError(true);
      throw error;
    }
  }, [swipedPolicies]);

  useEffect(() => {
    loadInitialPolicies();
    loadGifs();
  }, [loadInitialPolicies, loadGifs]);

  useEffect(() => {
    onPercentageUpdate((swipedPolicies.length / policies.length) * 100);
  }, [swipedPolicies.length, policies.length, onPercentageUpdate]);

  useEffect(() => {
    const isComplete = policies.length !== 0 && swipedPolicies.length === policies.length;
    if (!isComplete) return;

    toast.promise(
      saveVotes(),
      {
        loading: "Sauvegarde de votre vote...",
        success: "Votre vote a été sauvegardé",
        error: "Impossible de sauvegarder votre vote. Veuillez réessayer plus tard.",
      },
      { style: TOAST_STYLE },
    );
  }, [swipedPolicies, policies, saveVotes]);

  useEffect(() => {
    if (swipedPolicies.length === 0 || swipedPolicies.length !== policies.length) return;

    const score = MockAPI.get.score.compute(swipedPolicies);
    const bestCandidateId = Object.entries(score).reduce((a, b) => (a[1] > b[1] ? a : b))[0];

    if (bestCandidateId) {
      const candidate = MockAPI.get.candidates.fromId(bestCandidateId)?.profile;
      if (candidate) {
        setBestCandidate({
          id: bestCandidateId,
          name: candidate.name,
          slogan: candidate.slogan,
          sex: candidate.sex,
        });
      }
    }
  }, [swipedPolicies, policies]);

  const handleDrawerOpen = (title: string, description: string) => {
    setDrawerContent({ title, description });
    setDrawerOpen(true);
  };

  const renderActionButton = () => {
    if (voteId) {
      return (
        <Link href={`/vote/${voteId}?shareable=true`} className={styles.card__button__container}>
          <button className={styles.card__button}>{`Découvrez pourquoi`}</button>
        </Link>
      );
    }
    return (
      <button className={styles.card__button} disabled>
        <TailSpin width={20} height={20} strokeWidth={7} />
      </button>
    );
  };

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
              aria-label={gif.alt}
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
        <div
          className={styles.card__content}
          style={{ transform: `rotate(${index % 2 === 0 ? 5 : -5}deg)`, justifyContent: "space-between" }}
        >
          <div className={styles.card__header}>
            <span className={styles.card__header__theme}>{policy.theme}</span>
            <h3 className={styles.card__header__title}>{policy.title}</h3>
          </div>
          <button className="pressable" onClick={() => handleDrawerOpen(policy.title, policy.description)}>
            En savoir plus
          </button>
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
    <>
      <Drawer open={true} className={`${styles.drawer} ${drawerOpen ? styles.drawer__open : ""}`}>
        <h3>{drawerContent.title}</h3>
        <div className={styles.drawer__content}>
          <small>{drawerContent.description}</small>
        </div>
        <button className={styles.drawer__button} onClick={() => setDrawerOpen(false)}>
          Retour
        </button>
      </Drawer>
      <Drawer
        open={true}
        className={`${styles.drawer_mask} ${drawerOpen ? styles.drawer_mask__open : ""}`}
        onClick={() => setDrawerOpen(false)}
      />
      <div className={className}>
        {renderResultCard()}
        {renderLoaderCard()}
        {renderPolicyCards()}
        {renderInstructionCard()}
      </div>
    </>
  );
};

export default CardStack;
