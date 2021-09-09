import styles from "./StreamStage.module.css";

import lodash from "lodash";
import clsx from "clsx";

import Participants from "./components/Participants";
import Dominant from "./components/Dominant";
import { LayoutContext } from "./contexts/layout";

function StreamStage (props) {
  const layout = lodash(props).get("layout", "default");
  const participantGap = lodash(props).get("participantGap", 8);
  const children = lodash(props).get("children");

  // This props is just for development. Sometimes we don't want to have publisher and subscriber
  const empty = lodash(props).get("empty", false); 

  return (
    <LayoutContext.Provider
      value={{
        layout,
        participantGap
      }}
    >
      <div
        className={
          clsx({
            [styles.main]: true,
            [styles.dominant]: layout === "dominant"
          })
        }
      >
        { !empty && children }
      </div>
    </LayoutContext.Provider>
  )
}

StreamStage.Participants = Participants;
StreamStage.Dominant = Dominant;

export { useLayout } from "./hooks/layout";
export default StreamStage;
