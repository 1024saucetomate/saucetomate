import MatterScene from "@/components/MatterScene";
import styles from "@/styles/app/root.module.css";

export default function Root() {
  return (
    <>
      <h3 className={styles.header}>{"SAUCETOMATE"}</h3>
      <div className={styles.container}>
        <MatterScene className={styles.container__matterScene} />
        <div className={styles.container__menu}>
          <h1>{"Démarrer"}</h1>
          <h3>{"Les programmes"}</h3>
          <h3>{"À propos"}</h3>
        </div>
      </div>
    </>
  );
}
