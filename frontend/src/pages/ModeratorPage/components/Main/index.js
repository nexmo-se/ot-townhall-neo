import styles from "./Main.module.css";
import { useSession } from "components/OT";

import FullPageLoading from "components/FullPageLoading";

function Main ({ children }) {
  const { isConnected } = useSession()

  if (!isConnected) {
    return <FullPageLoading />
  } else {
    return (
      <main className={styles.main}>
        {children}
      </main>
    )
  }
}

export default Main;
