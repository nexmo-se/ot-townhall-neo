import React from "react";

import ControlButton from "components/ControlButton";
import BackgroundBlurIcon from '@material-ui/icons/BlurOn';
import CircularProgress from '@material-ui/core/CircularProgress';


function BackgroundBlurButton({ hasBackgroundBlurEffect, isBackgroundBlurLoading, ...props }){
  if (isBackgroundBlurLoading) {
    return (
      <CircularProgress
        {...props}
      />
    );
  }
  else {
  return (
      <ControlButton
        {...props}
        active={hasBackgroundBlurEffect}
        tooltip={hasBackgroundBlurEffect? "Disable Background Blur": "Enable Background Blur"}
      >
        <BackgroundBlurIcon fontSize="inherit"/>
      </ControlButton>
    )
  }
}

BackgroundBlurButton.defaultProps = { size: 50, fontSize: 24 }
export default BackgroundBlurButton;