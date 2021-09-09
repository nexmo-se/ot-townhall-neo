import IconPath from "@vonagevolta/volta2/dist/symbol/volta-icons.svg";
import styles from "./MediaButton.module.css";

import lodash from "lodash";
import Tooltip from "components/Tooltip";

function MediaButton (props) {
  const iconColor = lodash(props).get("iconColor", "white");
  const iconName = lodash(props).get("iconName");
  const onClick = lodash(props).get("onClick");
  const tooltip = lodash(props).get("tooltip");

  function handleClick () {
    if (onClick) onClick();
  }

  return (
    <Tooltip title={tooltip}>
      <div
        className={styles.main}
        onClick={handleClick}
      >
        <svg className={`Vlt-icon Vlt-icon--smaller Vlt-${iconColor}`}>
          <use xlinkHref={`${IconPath}#${iconName}`} />
        </svg>
      </div>
    </Tooltip>
  );
}

export default MediaButton;
