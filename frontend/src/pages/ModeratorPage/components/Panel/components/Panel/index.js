import styles from "./Panel.module.css";

function Panel ({ children }) {
  return (
    <section className={styles.main}>
      {children}
    </section>
  )
}

export default Panel;
