import styles from "./StartedPollingAction.module.css";

import { usePolling } from "components/PollingProvider";
import { useState } from "react";

function StartedPollingAction () {
  const [isLoading, setIsLoading] = useState(false);
  const { polling, stop } = usePolling();

  async function handleStopClick () {
    try {
      setIsLoading(true);
      await stop();
    } finally {
      setIsLoading(false);
    }
  }

  if (!polling) return null;
  else if (polling.status === "pending") return null;
  else {
    return (
      <div className={styles.actions}>
        <button
          className="Vlt-btn Vlt-btn--app Vlt-btn--destructive"
          onClick={handleStopClick}
          disabled={isLoading}
        >
          Stop Polling
        </button>
      </div>
    );
  }
}

export default StartedPollingAction;
