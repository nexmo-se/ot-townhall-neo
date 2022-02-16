import React from "react";

import ControlButton from "components/ControlButton";
import BackgroundBlurIcon from '@material-ui/icons/BlurOn';

function BackgroundBlurButton({ hasBackgroundBlurEffect, ...props }){
  return (
    <ControlButton 
      {...props}
      active={hasBackgroundBlurEffect}
      tooltip={hasBackgroundBlurEffect? "Disable Background Blue": "Enable Background Blur"}
    >
      <BackgroundBlurIcon fontSize="inherit"/>
    </ControlButton>
  )
}

BackgroundBlurButton.defaultProps = { size: 50, fontSize: 24 }
export default BackgroundBlurButton;