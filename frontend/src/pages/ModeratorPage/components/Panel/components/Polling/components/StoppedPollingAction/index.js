import styles from "./StoppedPollingAction.module.css";

import { usePolling } from "components/PollingProvider";
import { useState } from "react";

function StoppedPollingAction () {
  const [isLoading, setIsLoading] = useState(false);
  const { polling, reset, start } = usePolling();

  async function handleResetClick () {
    try {
      setIsLoading(true);
      await reset();
    } finally {
      setIsLoading(false);
    }
  }

  async function handleStartClick () {
    try {
      setIsLoading(true);
      await start();
    } finally {
      setIsLoading(false);
    }
  }

  if (!polling) return null;
  else if (polling.status !== "pending") return null;
  else {
    return (
      <div className={styles.actions}>
        <button
          className="Vlt-btn Vlt-btn--app Vlt-btn--tertiary"
          onClick={handleResetClick}
          disabled={isLoading}
        >
          Reset Polling
        </button>
        <button
          className="Vlt-btn Vlt-btn--app Vlt-btn--quaternary"
          onClick={handleStartClick}
          disabled={isLoading}
        >
          Start Polling
        </button>
      </div>
    );
  }
}

export default StoppedPollingAction;
