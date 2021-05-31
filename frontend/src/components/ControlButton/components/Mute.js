// @flow
import React from "react";
import { BaseProps } from "../types";

import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import ControlButton from "components/ControlButton";
import Tooltip from 'components/Tooltip';

interface MuteButtonProps extends BaseProps {
  hasAudio: boolean,
}

function MuteButton ({ hasAudio, ...props }: MuteButtonProps) {

  return (
    <ControlButton
      {...props}
      active={hasAudio}
    >
      {
        hasAudio? (
          <Tooltip title="Mute Microphone">
            <MicIcon fontSize="inherit"/>
          </Tooltip>
        ): (
          <Tooltip  title="Unmute Microphone">
            <MicOffIcon fontSize="inherit"/>
          </Tooltip>
        )
      }
    </ControlButton>
  )
}

MuteButton.defaultProps = { size: 50, fontSize: 24 }
export default MuteButton;