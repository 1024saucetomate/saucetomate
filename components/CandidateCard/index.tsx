import styles from "@/styles/components/candidate-card.module.css";
import type { CandidateCardProps, PolicyVote } from "@/utils/interfaces";
import MockAPI from "@/utils/MockAPI";

const CandidateCard = ({ candidateId, rank, policies }: CandidateCardProps): JSX.Element => {
  const candidate = MockAPI.get.candidates.fromId(candidateId);
  const badgeIndex = rank ? rank - 1 : 0;

  const getEquivalentText = (): string => {
    const gender = candidate?.profile.sex === "M" ? "un candidat" : "une candidate";
    return `En France, ${candidate?.profile.name} correspondrait à ${gender} 
      de ${candidate?.equivalent.party.toLowerCase()}.`;
  };

  const renderPolicy = (policy: PolicyVote) => {
    const policyData = MockAPI.get.policies.fromId(policy.id);
    if (policyData?.candidateId !== candidateId) return null;

    return (
      <div key={policy.id} className={styles.card__policy}>
        <span className={styles.card__policy__title}>{policyData.title}</span>
        <span className={policy.isFor ? styles.card__policy__for : styles.card__policy__against}>
          {policy.isFor ? "Pour" : "Contre"}
        </span>
      </div>
    );
  };

  return (
    <div className={styles.card}>
      <div className={styles.card__header}>
        <img
          src={candidate?.badges[badgeIndex].src}
          alt={`Photo de ${candidate?.profile.name}`}
          className={styles.card__image}
          draggable={false}
        />
        <div className={styles.card__content}>
          <h3>{candidate?.profile.name}</h3>
          <small>{candidate?.profile.description}</small>
          <small>{getEquivalentText()}</small>
        </div>
      </div>
      <div className={styles.card__divider} />
      <div className={styles.card__policies}>{policies.map(renderPolicy)}</div>
    </div>
  );
};

export default CandidateCard;
