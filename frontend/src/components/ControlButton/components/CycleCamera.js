// @flow
import React from "react";
import { BaseProps } from "../types";
import { Publisher } from "@opentok/client";

import FlipCameraIosIcon from '@material-ui/icons/FlipCameraIos';
import ControlButton from "../index";
import Tooltip from '@material-ui/core/Tooltip';

interface CycleCameraProps extends BaseProps {
  publisher: Publisher;
}

function CycleCameraButton ({ publisher, ...props }: CycleCameraProps) {
  function handleClick () {
    try {
      publisher.cycleVideo();
    } catch (err) {
      alert("You might only have one camera or something went wrong")
    }
  }

  return (
    <ControlButton
      {...props}
      onClick={handleClick}
      forceColor="Vlt-bg-aqua-dark"
    >
      <Tooltip arrow title={<h6 style={{fontSize: "14px", color: "white"}}>Cycle Camera</h6>}><FlipCameraIosIcon fontSize="inherit" /></Tooltip>
    </ControlButton>
  )
}

export default CycleCameraButton;
