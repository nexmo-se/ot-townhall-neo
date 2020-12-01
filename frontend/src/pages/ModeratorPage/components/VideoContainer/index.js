// @flow
import React from "react";
import lodash from "lodash";

import useStyles from "./styles";
import useVOD from "../../hooks/vod";

function VideoContainer() {
  const { videoSource, setVideoRef } = useVOD();
  const mStyles = useStyles();

  return (
    <div className={mStyles.root}>
      { !lodash.isEmpty(videoSource) && (
        <video
          ref={setVideoRef}
          src={videoSource}
          className={mStyles.video}
          controls
        />
      )}
    </div>
  )
}
export default VideoContainer;