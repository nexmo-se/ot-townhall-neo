// @flow
import React from "react";
import useStyles from "./styles";

import LayoutContainer from "components/LayoutContainer";

function ModeratorStream(){
  const mStyles = useStyles();
  
  return(
    <div className={mStyles.moderator}>
      <LayoutContainer
        id="moderatorContainer"
        size="big" 
      />
    </div>
  ) 
}
export default ModeratorStream;