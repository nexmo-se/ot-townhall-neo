// @flow
import React from "react";
import lodash from "lodash";
import useVOD from "../../hooks/vod";

import VideoContainer from "../VideoContainer";
import LayoutContainer from "components/LayoutContainer";

function MainScreen() {
  const { videoSource } = useVOD();

  return (
    <>
      <LayoutContainer
        id="cameraContainer"
        size={lodash.isEmpty(videoSource)? "big": "small"}
      />
      <VideoContainer />
    </>
  )
}
export default MainScreen;