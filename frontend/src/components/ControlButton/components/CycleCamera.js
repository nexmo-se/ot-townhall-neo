// @flow
import React from "react";
import { BaseProps } from "../types";
import { Publisher } from "@opentok/client";

import FlipCameraIosIcon from '@material-ui/icons/FlipCameraIos';
import ControlButton from "../index";

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
      <FlipCameraIosIcon fontSize="inherit" />
    </ControlButton>
  )
}

export default CycleCameraButton;
