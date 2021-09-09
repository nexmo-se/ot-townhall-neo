import styles from "./UserItem.module.css";
import lodash from "lodash";
import clsx from "clsx";

import Avatar from "components/Avatar";
import AudioButton from "./components/AudioButton";
import VideoButton from "./components/VideoButton";
import ForceLeaveButton from "./components/ForceLeaveButton";

function UserItem (props) {
  const isLive = lodash(props).get("isLive", false);

  return (
    <div className={styles.main}>
      <div className={styles.avatar}>
        <Avatar
          size={35}
          user={{ name: "Frans Siswanto" }}
          
        />
        {
          isLive && (
            <span className="Vlt-status Vlt-green"></span>
          )
        }
      </div>
      <div className={styles.detail}>
        <div className={styles.nameContainer}>
          <p
            className={
              clsx({
                "Vlt-purple-dark": isLive,
                [styles.nameLive]: isLive
              })
            }
          >
            Frans Siswanto
          </p>
        </div>
        {
          isLive && (
            <div className={styles.controller}>
              <AudioButton />
              <VideoButton />
              <ForceLeaveButton />
            </div>
          )
        }
      </div>
    </div>
  )
}

export default UserItem;
