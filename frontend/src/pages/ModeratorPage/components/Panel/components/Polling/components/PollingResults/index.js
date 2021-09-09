import styles from "./PollingResults.module.css";

import useInterval from "use-interval";
import { usePolling } from "components/PollingProvider";

import PollingResultItem from "../PollingResultItem";
import Icon from "components/Icon";

function PollingResults () {
  const { polling, retrieve } = usePolling();

  function handleRefreshClick () {
    retrieve();
  }

  /**
   * Every 5 seconds, it will automaticaly refresh the data,
   * so the polling will be a bit of realtime
   */
  useInterval(
    () => {
      retrieve();
    },
    5000
  )

  return (
    <div>
      <div className={styles.header}>
        <h4>
          Results
        </h4>
        <div className={styles.actions}>
          <div onClick={handleRefreshClick}>
            <Icon
              name="Vlt-icon-refresh-full"
              className="Vlt-icon--smaller"
            />
          </div>
        </div>
      </div>
      {
        (!polling)? (
          <p>No polling at the moment.</p>
        ): (
          polling.items.map(
            (item) => (
              <PollingResultItem
                key={item.id}
                item={item}
              />
            )
          )
        )
      }
    </div>
  )
}

export default PollingResults;
