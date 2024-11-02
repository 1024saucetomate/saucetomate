"use client";

import axios from "axios";
import { parseAsBoolean, useQueryState } from "nuqs";
import { useEffect, useState } from "react";

import CandidateCard from "@/components/CandidateCard";
import Link from "@/components/Link";
import styles from "@/styles/app/vote.module.css";
import MockAPI from "@/utils/MockAPI";

export default function Vote({ params }: { params: { id: string } }) {
  const [vote, setVote] = useState<{
    id: string;
    candidateId: string;
    policies: {
      id: string;
      isFor: boolean;
    }[];
    createdAt: string;
    updatedAt: string;
  } | null>(null);
  const [shareable, setShareable] = useQueryState(
    "shareable",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true }),
  );
  const [score, setScore] = useState<
    {
      [candidateId: string]: number;
    }[]
  >([]);

  useEffect(() => {
    axios.get(`/api/vote/${params.id}`).then((response) => {
      setVote({
        id: response.data.data.id,
        candidateId: response.data.data.candidateId,
        policies: response.data.data.policies.map((policy: string) => JSON.parse(policy)),
        createdAt: response.data.data.createdAt,
        updatedAt: response.data.data.updatedAt,
      });
    });
  }, [params.id]);

  useEffect(() => {
    if (!navigator.canShare && shareable) {
      setShareable(false);
    }
  }, []);

  useEffect(() => {
    if (vote) {
      const computedScore = MockAPI.get.score.compute(vote.policies);
      setScore(
        Object.entries(computedScore)
          .sort(([, a], [, b]) => b - a)
          .reduce(
            (acc, [key, value]) => {
              acc.push({ [key]: value });
              return acc;
            },
            [] as { [candidateId: string]: number }[],
          )
          .slice(0, 2),
      );
    }
  }, [vote]);

  const shareVote = () => {
    navigator.share({
      title: "Je viens de voter ! 🇺🇸",
      text: `Je viens de découvrir pour quel candidat je voterais, d'après mes préférences ! #USA2024`,
      url: `${window.location.origin}/vote/${vote?.id}`,
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/">
          <h3>Retour</h3>
        </Link>
        {shareable && (
          <h3 className={styles.header__shareable} onClick={shareVote}>
            Partager mon vote
          </h3>
        )}
      </div>
      <div className={styles.content}>
        <h3 className={styles.content__title}>Récapitulatif de vos choix</h3>
        <div className={styles.content__view}>
          {score.map((candidateScore, index) => {
            const candidateId = Object.keys(candidateScore)[0];
            return (
              <div key={index} className={styles.content__view__column}>
                <CandidateCard key={index} candidateId={candidateId} rank={index + 1} policies={vote?.policies || []} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
