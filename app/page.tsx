import Link from "@/components/Link";
import Matter from "@/components/Matter";
import styles from "@/styles/app/root.module.css";

export default function Root() {
  return (
    <div className={styles.container}>
      <div className={styles.container__menu}>
        <h1>SAUCETOMATE</h1>
        <div>
          <Link href="#">
            <h3>Démarrer</h3>
          </Link>
          <Link href="#">
            <h3>Les programmes</h3>
          </Link>
          <Link href="#">
            <h3>À propos</h3>
          </Link>
        </div>
      </div>
      <Matter.CandidatesBubble className={styles.container__scene} />
    </div>
  );
}
