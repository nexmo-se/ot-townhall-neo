import styles from "./Dominant.module.css";

import { useLayout } from "../../hooks/layout";

function Dominant ({ children }) {
  const { layout } = useLayout();

  if (layout !== "dominant") return null;
  else {
    return (
      <section className={styles.main}>
        {children}
      </section>
    )
  }
}

export default Dominant;