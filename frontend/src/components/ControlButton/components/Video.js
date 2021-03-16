// @flow
import React from "react";
import { BaseProps } from "../types";

import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import ControlButton from "../index";

interface VideoButtonProps extends BaseProps {
  hasVideo: boolean,
}

function VideoButton ({ hasVideo, ...props }: VideoButtonProps) {
  return (
    <ControlButton 
      {...props}
      active={hasVideo}
    >
      {hasVideo? <VideocamIcon fontSize="inherit"/>: <VideocamOffIcon fontSize="inherit"/>}
    </ControlButton>
  )
}

VideoButton.defaultProps = { size: 50, fontSize: 24 }
export default VideoButton;