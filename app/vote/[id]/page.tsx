"use client";

import axios from "axios";
import { useEffect, useState } from "react";

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
  return (
    <>
      <h1>Vous avez votez pour {MockAPI.get.candidates.fromId(vote?.candidateId ?? "")?.profile.name}</h1>
      <h3>Politiques : </h3>
      <ul>
        {vote?.policies.map((policy) => (
          <li key={policy.id}>
            {policy.isFor ? "Pour" : "Contre"} {MockAPI.get.policies.fromId(policy.id)?.title}
          </li>
        ))}
      </ul>
    </>
  );
}
