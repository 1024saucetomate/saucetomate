"use client";

import { useEffect, useState } from "react";
import Link from "@/components/Link";
import coreDataImport from "@/data/core.json";
import styles from "@/styles/app/programs.module.css";

type PolicyType = {
  title: string;
  description: string;
  category: string;
  source: {
    name: string;
    url: string;
  };
};

type CandidateDataType = {
  description: string;
  policies: PolicyType[];
};

type CoreDataType = {
  [key: string]: CandidateDataType;
};

const coreData: CoreDataType = coreDataImport;

export default function Programs() {
  const [candidates, setCandidates] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [query, setQuery] = useState<{
    candidate: string;
    category: string;
  }>({ candidate: "", category: "" });
  const [programs, setPrograms] = useState<PolicyType[]>([]);

  useEffect(() => {
    const candidates = Object.keys(coreData);
    setCandidates(candidates);
    const categories = Array.from(
      new Set(
        Object.values(coreData)
          .map((candidate) => candidate.policies)
          .flat()
          .map((policy) => policy.category),
      ),
    );
    setCategories(categories);
    setQuery({ candidate: candidates[0], category: categories[0] });
  }, []);

  useEffect(() => {
    if (!query.candidate || !query.category) return;
    setPrograms(
      coreData[query.candidate].policies.filter(
        (policy) => policy.category === query.category,
      ),
    );
  }, [query]);

  return (
    <div className={styles.container}>
      <div className={styles.container__menu}>
        <Link href="/" className={styles.container__menu__back}>
          <h3>{"Retour"}</h3>
        </Link>
        <div className={styles.container__menu__candidates_wrapper}>
          <div className={styles.container__menu__candidates}>
            {candidates.map((candidate) => (
              <h1
                key={candidate}
                onClick={() => setQuery({ ...query, candidate })}
                style={{
                  color:
                    query.candidate === candidate
                      ? "var(--color-white)"
                      : "var(--color-black)",
                }}
              >
                {candidate}
              </h1>
            ))}
          </div>
        </div>
        <div className={styles.container__menu__categories_wrapper}>
          <div className={styles.container__menu__categories}>
            {categories.map((category) => (
              <h3
                key={category}
                onClick={() => setQuery({ ...query, category })}
                style={{
                  color:
                    query.category === category
                      ? "var(--color-white)"
                      : "var(--color-black)",
                }}
              >
                {category}
              </h3>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.container__programs}>
        {programs.map((program, index) => (
          <div key={index} className={styles.container__program}>
            <h3>{program.title}</h3>
            <small>{program.description}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
