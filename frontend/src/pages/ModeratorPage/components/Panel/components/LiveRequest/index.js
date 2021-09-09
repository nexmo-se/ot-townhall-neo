import styles from "./LiveRequest.module.css";

import Panel from "../Panel";
import RequestItem from "../../../RequestItem";

function LiveRequest () {
  return (
    <Panel>
      <h4>Requests To Go Live (3)</h4>
      <div className={styles.requestList}>
        <RequestItem />
        <RequestItem />
        <RequestItem />
        <RequestItem />
        <RequestItem />
        <RequestItem />
        <RequestItem />
        <RequestItem />
        <RequestItem />
        <RequestItem />
      </div>
    </Panel>
  )
}

export default LiveRequest;
