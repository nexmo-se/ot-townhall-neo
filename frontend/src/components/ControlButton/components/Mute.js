// @flow
import React from "react";
import { BaseProps } from "../types";

import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import ControlButton from "components/ControlButton";
import Tooltip from '@material-ui/core/Tooltip';

interface MuteButtonProps extends BaseProps {
  hasAudio: boolean,
}

function MuteButton ({ hasAudio, ...props }: MuteButtonProps) {

  return (
    <ControlButton
      {...props}
      active={hasAudio}
    >
      {hasAudio? <Tooltip arrow title={<h6 style={{fontSize: "14px", color: "white"}}>Mic Off</h6>}><MicIcon fontSize="inherit"/></Tooltip>: <Tooltip arrow title={<h6 style={{fontSize: "14px", color: "white"}}>Mic On</h6>}><MicIcon fontSize="inherit"/></Tooltip>}
    </ControlButton>
  )
}

MuteButton.defaultProps = { size: 50, fontSize: 24 }
export default MuteButton;