// @flow
import React from "react";
import OT from "@opentok/client";
import { BaseProps } from "../types";
import { Publisher } from "@opentok/client";
import { useState, useEffect } from "react";

import FlipCameraIosIcon from '@material-ui/icons/FlipCameraIos';
import ControlButton from "../index";

interface CycleCameraProps extends BaseProps {
  publisher: Publisher;
}

function CycleCameraButton ({ publisher, ...props }: CycleCameraProps) {
  const [countCamera, setCountCamera] = useState<number>(1);

  function handleClick () {
    try {
      publisher.cycleVideo();
    } catch (err) {
      alert("You might only have one camera or something went wrong")
    }
  }

  useEffect(
    () => {
      OT.getDevices(
        (err, devices) => {
          if (err) return;

          const cameras = devices.filter(
            (device) => device.kind === "videoInput"
          );
          console.log(cameras);
          setCountCamera(cameras.length);
        }
      )
    },
    []
  )

  if (countCamera === 1) return null;
  else {
    return (
      <ControlButton
        {...props}
        onClick={handleClick}
        forceColor="Vlt-bg-aqua-dark"
        tooltip="Switch Camera"
      >
        <FlipCameraIosIcon fontSize="inherit" />
      </ControlButton>
    )
  }
}

export default CycleCameraButton;
