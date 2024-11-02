import styles from "@/styles/components/candidate-card.module.css";
import MockAPI from "@/utils/MockAPI";

export default function CandidateCard({
  candidateId,
  rank,
  policies,
}: {
  candidateId: string;
  rank?: number;
  policies: { id: string; isFor: boolean }[];
}) {
  return (
    <div className={styles.card}>
      <div className={styles.card__header}>
        <img
          src={MockAPI.get.candidates.fromId(candidateId)?.badges[rank ? rank - 1 : 0].src}
          alt={`Photo de ${MockAPI.get.candidates.fromId(candidateId)?.profile.name}`}
          className={styles.card__image}
          draggable={false}
        />
        <div className={styles.card__content}>
          <h3>{MockAPI.get.candidates.fromId(candidateId)?.profile.name}</h3>
          <small>{MockAPI.get.candidates.fromId(candidateId)?.profile.description}</small>
          <small>{`En France, ${MockAPI.get.candidates.fromId(candidateId)?.profile.name} correspondrait à
        ${MockAPI.get.candidates.fromId(candidateId)?.profile.sex === "M" ? "un candidat" : "une candidate"}
        de ${MockAPI.get.candidates.fromId(candidateId)?.equivalent.party.toLocaleLowerCase()}
        comme ${MockAPI.get.candidates.fromId(candidateId)?.equivalent.names.join(" ou ")}.`}</small>
        </div>
      </div>
      <div className={styles.card__divider} />
      <div className={styles.card__policies}>
        {policies.map((policy) => {
          if (MockAPI.get.policies.fromId(policy.id)?.candidateId === candidateId) {
            return (
              <div key={policy.id} className={styles.card__policy}>
                <span className={styles.card__policy__title}>{MockAPI.get.policies.fromId(policy.id)?.title}</span>
                <span className={policy.isFor ? styles.card__policy__for : styles.card__policy__against}>
                  {policy.isFor ? "Pour" : "Contre"}
                </span>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}
