import styles from "./Polling.module.css";

import Panel from "../Panel";
import QuestionSection from "./components/QuestionSection";
import PollingBadge from "./components/PollingBadge";
import PollingResults from "./components/PollingResults";
import PollingProvider from "components/PollingProvider";

function Polling () {
  return (
    <PollingProvider>
      <Panel>
        <h3 className={styles.title}>
          Polling
          <PollingBadge />
        </h3>
        <QuestionSection />
        <hr />
        <PollingResults />
      </Panel>
    </PollingProvider>
  );
}

export default Polling;
