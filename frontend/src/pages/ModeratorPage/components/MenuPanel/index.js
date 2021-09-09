import styles from "./MenuPanel.module.css";

import { useMenu } from "../MenuProvider";
import { useCallback } from "react";

import Panel from "../Panel";

function MenuPanel () {
  const { currentMenu } = useMenu();

  const renderPanel = useCallback(
    () => {
      if (currentMenu === "participants") {
        return <Panel.Participants />
      } else if (currentMenu === "chat") {
        return <Panel.Chat />
      } else if (currentMenu === "go-live-requests") {
        return <Panel.LiveRequest />
      } else if (currentMenu === "questions") {
        return <Panel.Questions />
      } else if (currentMenu === "polling") {
        return <Panel.Polling />
      } else if (currentMenu === "settings") {
        return <Panel.Settings />
      }
    },
    [currentMenu]
  )

  return (
    <div className={styles.menuPanel}>
      {renderPanel()}
    </div>
  )
}

export default MenuPanel;
