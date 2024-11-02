"use client";

import axios from "axios";
import { parseAsBoolean, useQueryState } from "nuqs";
import { useCallback, useEffect, useState } from "react";

import CandidateCard from "@/components/CandidateCard";
import Link from "@/components/Link";
import styles from "@/styles/app/vote.module.css";
import type { CandidateScore, Vote, VoteProps } from "@/utils/interfaces";
import MockAPI from "@/utils/MockAPI";

const Vote = ({ params }: VoteProps): JSX.Element => {
  const [voteData, setVoteData] = useState<Vote | null>(null);
  const [shareable, setShareable] = useQueryState(
    "shareable",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true }),
  );
  const [scores, setScores] = useState<CandidateScore[]>([]);

  const fetchVoteData = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/vote/${params.id}`);
      setVoteData({
        ...data.data,
        policies: data.data.policies.map((policy: string) => JSON.parse(policy)),
      });
    } catch (error) {
      console.error("Error fetching vote data:", error);
    }
  }, [params.id]);

  const computeScores = useCallback(() => {
    if (!voteData) return;
    const computedScore = MockAPI.get.score.compute(voteData.policies);
    const sortedScores = Object.entries(computedScore)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2)
      .map(([key, value]) => ({ [key]: value }));
    setScores(sortedScores);
  }, [voteData]);

  const handleShare = async () => {
    if (!voteData) return;
    try {
      await navigator.share({
        title: "Je viens de voter ! 🇺🇸",
        text: "Je viens de découvrir pour quel candidat je voterais, d'après mes préférences ! #USA2024",
        url: `${window.location.origin}/vote/${voteData.id}`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  useEffect(() => {
    fetchVoteData();
  }, [params.id, fetchVoteData]);

  useEffect(() => {
    if (!navigator.canShare && shareable) {
      setShareable(false);
    }
  }, [setShareable, shareable]);

  useEffect(() => {
    if (voteData) {
      computeScores();
    }
  }, [voteData, computeScores]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/">
          <h3>Retour</h3>
        </Link>
        {shareable && (
          <h3 className={styles.header__shareable} onClick={handleShare}>
            Partager mon vote
          </h3>
        )}
      </div>
      <div className={styles.content}>
        <h3 className={styles.content__title}>Récapitulatif de vos choix</h3>
        <div className={styles.content__view}>
          {scores.map((score, index) => {
            const candidateId = Object.keys(score)[0];
            return (
              <div key={index} className={styles.content__view__column}>
                <CandidateCard candidateId={candidateId} rank={index + 1} policies={voteData?.policies || []} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Vote;
