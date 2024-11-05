"use client";

import { useEffect, useState } from "react";
import Select from "react-select";

import Link from "@/components/Link";
import styles from "@/styles/app/policies.module.css";
import { Candidate, FilterSelectProps, PoliciesProps, Policy, SelectOption } from "@/utils/interfaces";
import MockAPI from "@/utils/MockAPI";

const selectStyles = {
  // eslint-disable-next-line
  control: (baseStyles: any) => ({
    ...baseStyles,
    backgroundColor: "var(--color-white)",
    border: "3px solid var(--color-black)",
    borderRadius: "0",
    boxShadow: "none",
    "&:hover": {
      border: "3px solid var(--color-black)",
    },
  }),
  // eslint-disable-next-line
  menu: (baseStyles: any) => ({
    ...baseStyles,
    backgroundColor: "var(--color-white)",
    border: "3px solid var(--color-black)",
    borderRadius: "0",
    boxShadow: "none",
  }),
  // eslint-disable-next-line
  option: (baseStyles: any, state: any) => ({
    ...baseStyles,
    backgroundColor: state.isSelected ? "var(--color-black)" : "var(--color-white)",
    color: state.isSelected ? "var(--color-white)" : "var(--color-black)",
    "&:hover": {
      backgroundColor: "var(--color-black)",
      color: "var(--color-white)",
    },
  }),
};

const FilterSelect: React.FC<FilterSelectProps> = ({
  options,
  onChange,
  placeholder,
  defaultValue,
  noOptionsMessage,
}) => (
  <Select
    options={options}
    onChange={(option) => onChange(option?.value || "")}
    placeholder={placeholder}
    noOptionsMessage={() => noOptionsMessage}
    styles={selectStyles}
    defaultValue={defaultValue}
    className={styles.content__filter__select}
  />
);

const PolicyCard: React.FC<{ policy: Policy; candidateName: string }> = ({ policy, candidateName }) => (
  <div className={styles.policy}>
    <div className={styles.policy__header}>
      <div className={styles.policy__header__info}>
        <span>{candidateName}</span>
        <span>{policy.category}</span>
      </div>
      <h4>{policy.title}</h4>
    </div>
    <p>{policy.description}</p>
  </div>
);

const Policies: React.FC<PoliciesProps> = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [policies, setPolicies] = useState<Policy[]>([]);

  useEffect(() => {
    setCandidates(MockAPI.get.candidates.all());
    setPolicies(MockAPI.get.policies.all());
  }, []);

  useEffect(() => {
    const filteredPolicies = MockAPI.get.policies.all().filter((policy) => {
      const candidateMatch = !selectedCandidate || policy.candidateId === selectedCandidate;
      const categoryMatch = !selectedCategory || policy.category === selectedCategory;
      return candidateMatch && categoryMatch;
    });
    setPolicies(filteredPolicies);
  }, [selectedCandidate, selectedCategory]);

  const candidateOptions: SelectOption[] = [
    { value: "", label: "Tous les candidats" },
    ...candidates.map((candidate) => ({
      value: candidate.id,
      label: candidate.profile.name,
    })),
  ];

  const categoryOptions: SelectOption[] = [
    { value: "", label: "Toutes les catégories" },
    ...MockAPI.get.policies.categories().map((category) => ({
      value: category,
      label: category,
    })),
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/">
          <h3>Retour</h3>
        </Link>
      </div>
      <div className={styles.content}>
        <h3 className={styles.content__text}>Les programmes</h3>
        <div className={styles.content__filter}>
          <FilterSelect
            options={candidateOptions}
            onChange={setSelectedCandidate}
            placeholder="Filtrer par candidat"
            defaultValue={candidateOptions[0]}
            noOptionsMessage="Aucun candidat trouvé"
          />
          <FilterSelect
            options={categoryOptions}
            onChange={setSelectedCategory}
            placeholder="Filtrer par catégorie"
            defaultValue={categoryOptions[0]}
            noOptionsMessage="Aucune catégorie trouvée"
          />
        </div>
        <div className={styles.divider} />
        <div className={styles.policies}>
          {policies.map((policy) => {
            const candidateName = candidates.find((c) => c.id === policy.candidateId)?.profile.name || "";
            return <PolicyCard key={policy.id} policy={policy} candidateName={candidateName} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Policies;
