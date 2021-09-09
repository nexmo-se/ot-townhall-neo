import styles from "./RoomBadge.module.css";

import clsx from "clsx";
import { useRoom } from "../RoomControlProvider";

function RoomBadge () {
  const { status } = useRoom();

  function renderLabel () {
    if (status === "locked") {
      return "Closed";
    } else if (status === "open") {
      return "Open";
    } else {
      return "Unknown";
    }
  }
  
  return (
    <div
      className={
        clsx({
          "Vlt-badge": true,
          "Vlt-badge--red": status === "locked",
          "Vlt-badge--green": status === "open",
          "Vlt-badge--grey": status !== "locked" || status !== "open",
          "Vlt-badge--transparent": true,
          [styles.badge]: true
        })
      }
    >
      {renderLabel()}
    </div>
  )
}

export default RoomBadge;
