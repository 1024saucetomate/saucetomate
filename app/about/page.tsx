"use client";

import NextLink from "next/link";

import Link from "@/components/Link";
import styles from "@/styles/app/about.module.css";
import { AboutProps, FAQItem } from "@/utils/interfaces";

const faqItems: FAQItem[] = [
  {
    question: "Pourquoi le nombre de propositions diffère-t-il entre les candidats ?",
    answer:
      "Le nombre de propositions varie entre les candidats afin de minimiser les risques de scores identiques. La sélection des candidats ayant une proposition supplémentaire ou en moins est effectuée de manière aléatoire.",
  },
  {
    question: "Comment sont sélectionnées les propositions ?",
    answer:
      "Un travail préalable rigoureux a permis de retenir des propositions variées et représentatives de chaque candidat. Les propositions affichées lors du test sont choisies de façon aléatoire parmi cette sélection.",
  },
  {
    question: "Comment les scores sont-ils calculés ?",
    answer:
      "Les scores sont établis en fonction de vos réponses aux propositions. Plus vos réponses sont en accord avec celles d'un candidat, plus votre score associé à ce candidat sera élevé. Le candidat qui vous correspond le mieux est celui dont le score atteint le niveau le plus élevé.",
  },
];

const TeamMember = ({ name, emojiClass }: { name: string; emojiClass: string }) => (
  <>
    {name}
    <span className={styles[emojiClass]} />
  </>
);

const About: React.FC<AboutProps> = () => (
  <div className={styles.container}>
    <div className={styles.header}>
      <Link href="/">
        <h3>Retour</h3>
      </Link>
    </div>

    <div className={styles.content}>
      <h3 className={styles.content__text}>
        <span>SAUCETOMATE</span> est une application conçue par{" "}
        <span>
          <TeamMember name="Yaniv" emojiClass="emojiYaniv" />, <TeamMember name="Margaux" emojiClass="emojiMargaux" />{" "}
          et <TeamMember name="Nayla" emojiClass="emojiNayla" />
        </span>{" "}
        dans le cadre du projet d&apos;EMC dédié aux <span>élections américaines</span> de 2024. Notre objectif est de
        rendre la politique plus <span>accessible et interactive</span>, en aidant chacun à découvrir quel candidat
        américain correspond le mieux à ses <span>opinions</span> et <span>valeurs</span>. En vous proposant une série
        de questions et d&apos;affirmations sur des <span>thèmes variés</span>&nspb; (économie, environnement,
        immigration, politique étrangère, etc.), nous analysons vos choix pour calculer un score. Ce score vous permet
        ensuite d&apos;<span>identifier le candidat</span> qui semble le plus en phase avec vos <span>préférences</span>{" "}
        et préoccupations.
      </h3>

      <h3 className={styles.content__os}>
        SAUCETOMATE est un projet open-source sous licence AGPL-3.0. Si vous souhaitez participer à son développement et
        à son évolution, vous pouvez contribuer directement sur le&nbsp;
        <NextLink href="https://github.com/1024saucetomate/saucetomate" className={styles.link} target="_blank">
          dépôt GitHub
        </NextLink>
        .
      </h3>

      <div className={styles.divider} />

      <dl className={styles.faq}>
        {faqItems.map((item, index) => (
          <div key={index}>
            <dt>
              <h3>{item.question}</h3>
            </dt>
            <dd>{item.answer}</dd>
          </div>
        ))}
      </dl>
    </div>
  </div>
);

export default About;
