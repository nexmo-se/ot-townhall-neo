// @flow
import React from "react";
import useStyles from "./styles";

import IFrame from "components/IFrame";

function RemoteSlidesPanel() {
  const mStyles = useStyles();
  
  return (
    <div className={mStyles.root}>
      <IFrame 
        src="https://slides.limhenry.xyz/220076"
      />
      <div className={mStyles.topCover}>
        &nbsp;
      </div>
      <div className={mStyles.bottomCover}>
        &nbsp;
      </div>
    </div>
  ) 
}
export default RemoteSlidesPanel;