// @flow
import React from "react";
import { BaseProps } from "../types";

import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import ControlButton from "components/ControlButton";

interface MuteButtonProps extends BaseProps {
  hasAudio: boolean,
}

function MuteButton ({ hasAudio, ...props }: MuteButtonProps) {

  return (
    <ControlButton
      {...props}
      active={hasAudio}
    >
      {hasAudio? <MicIcon fontSize="inherit"/>: <MicOffIcon fontSize="inherit"/>}
    </ControlButton>
  )
}

MuteButton.defaultProps = { size: 50, fontSize: 24 }
export default MuteButton;