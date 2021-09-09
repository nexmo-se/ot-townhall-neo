import styles from "./ActionButton.module.css";

import lodash from "lodash";
import clsx from "clsx";

import Icon from "components/Icon";

function ActionButton (props) {
  const iconName = lodash(props).get("iconName");
  const iconColor = lodash(props).get("iconColor", "white");
  const backgroundColor = lodash(props).get("backgroundColor", "green");

  return (
    <div
      className={
        clsx({
          [styles.main]: true,
          [styles.red]: backgroundColor === "red",
          [styles.green]: backgroundColor === "green"
        })
      }
    >
      <Icon
        name={iconName}
        className={`Vlt-icon--smaller Vlt-${iconColor}`}
      />
    </div>
  )  
}

export default ActionButton;
