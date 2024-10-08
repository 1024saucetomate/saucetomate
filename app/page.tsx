import Link from "@/components/Link";
import MatterScene from "@/components/MatterScene";
import styles from "@/styles/app/root.module.css";

export default function Root() {
  return (
    <>
      <h3 className={styles.header}>{"SAUCETOMATE"}</h3>
      <div className={styles.container}>
        <MatterScene className={styles.container__matterScene} />
        <div className={styles.container__menu}>
          <Link href="/core">
            <h1>{"Démarrer"}</h1>
          </Link>
          <Link href="/programs">
            <h3>{"Les programmes"}</h3>
          </Link>
          <h3>{"À propos"}</h3>
        </div>
      </div>
    </>
  );
}
