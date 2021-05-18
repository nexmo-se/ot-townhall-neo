// @flow
import React from "react";
import { BaseProps } from "../types";

import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import ControlButton from "../index";
import Tooltip from '@material-ui/core/Tooltip';

interface VideoButtonProps extends BaseProps {
  hasVideo: boolean,
}

function VideoButton ({ hasVideo, ...props }: VideoButtonProps) {
  return (
    <ControlButton 
      {...props}
      active={hasVideo}
    >
      {hasVideo? <Tooltip arrow title={<h6 style={{fontSize: "14px", color: "white"}}>Video Off</h6>}><VideocamIcon fontSize="inherit"/></Tooltip>: <Tooltip arrow title={<h6 style={{fontSize: "14px", color: "white"}}>Video On</h6>}><VideocamOffIcon fontSize="inherit"/></Tooltip>}
    </ControlButton>
  )
}

VideoButton.defaultProps = { size: 50, fontSize: 24 }
export default VideoButton;