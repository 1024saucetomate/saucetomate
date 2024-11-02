import Link from "@/components/Link";
import styles from "@/styles/app/not-found.module.css";
import type { NotFoundProps } from "@/utils/interfaces";

const NotFound: React.FC<NotFoundProps> = (): JSX.Element => {
  return (
    <div className={styles.container}>
      <h1>404</h1>
      <Link href="/">
        <h3>Retour à l&apos;accueil</h3>
      </Link>
    </div>
  );
};

export default NotFound;
