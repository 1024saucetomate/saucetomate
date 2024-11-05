import Link from "@/components/Link";
import Matter from "@/components/Matter";
import styles from "@/styles/app/root.module.css";
import type { RootProps } from "@/utils/interfaces";

const Root: React.FC<RootProps> = (): JSX.Element => {
  return (
    <div className={styles.container}>
      <nav className={styles.container__menu}>
        <h1>SAUCETOMATE</h1>
        <div>
          <Link href="/swipe">
            <h3>Démarrer</h3>
          </Link>
          <Link href="/policies">
            <h3>Les programmes</h3>
          </Link>
          <Link href="/about">
            <h3>À propos</h3>
          </Link>
        </div>
      </nav>
      <Matter.CandidatesBubble className={styles.container__scene} />
    </div>
  );
};

export default Root;
