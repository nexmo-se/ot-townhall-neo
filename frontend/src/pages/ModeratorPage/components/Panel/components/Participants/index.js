import styles from "./Participants.module.css";

import Panel from "../Panel";
import UserItem from "../../../UserItem";

function Participants () {
  return (
    <Panel>
      <h3>
        Participants (3)
      </h3>
      <div className={styles.participantList}>
        <UserItem isLive />
        <UserItem isLive />
        <UserItem isLive />
        <UserItem />
        <UserItem />
        <UserItem />
        <UserItem />
        <UserItem />
        <UserItem />
        <UserItem />
        <UserItem />
        <UserItem />
        <UserItem />
        <UserItem />
        <UserItem />
        <UserItem />
        <UserItem />
        <UserItem />
        <UserItem />
        <UserItem />
      </div>
    </Panel>
  );
}

export default Participants;
