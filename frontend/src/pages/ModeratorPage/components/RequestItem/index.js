import styles from "./RequestItem.module.css";

import Avatar from "components/Avatar";

function RequestItem () {
  return (
    <div className={styles.main}>
      <div className={styles.avatar}>
        <Avatar
          size={35}
          user={{ name: "Frans Siswanto" }}
        />
      </div>
      <div className={styles.detail}>
        <div className={styles.nameContainer}>
          <p>
            <strong>Frans Siswanto</strong>
          </p>
        </div>
        <div className={styles.actions}>
          <span className="Vlt-grey-darker">
            Decline
          </span>
          <span className="Vlt-purple-dark">
            Accept
          </span>
        </div>
      </div>
    </div>
  )
}

export default RequestItem;
