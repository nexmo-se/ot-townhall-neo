import styles from "./NoPollingAction.module.css";
import { usePolling } from "components/PollingProvider";

function NoPollingAction ({ onAddItemClick, onCreateClick, disabled }) {
  const { polling } = usePolling();

  if (polling) return null;
  else {
    return (
      <div className={styles.actions}>
        <button
          className="Vlt-btn Vlt-btn--app Vlt-btn--tertiary"
          onClick={onAddItemClick}
        >
          Add Item
        </button>
        <button
          className="Vlt-btn Vlt-btn--app Vlt-btn--secondary"
          onClick={onCreateClick}
          disabled={disabled}
        >
          Create Polling
        </button>
      </div>
    )
  }
}

export default NoPollingAction;
