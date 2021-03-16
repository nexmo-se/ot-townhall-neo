// @flow
import React from "react";
import type { Node } from "react";

import useStyles from "./styles";
import useSession from "hooks/session";
import useMessage from "hooks/message";
import { Publisher } from "@opentok/client";

import ControlButton from "components/ControlButton";

interface VideoControlProps {
  sizeMultiplier?: number;
  publisher?: Publisher;
  unpublish?: Function;
  children?: Node
}

function VideoControl ({ sizeMultiplier=1, publisher, unpublish, children }: VideoControlProps) {
  const [hasAudio, setHasAudio] = React.useState(true);
  const [hasVideo, setHasVideo] = React.useState(true);
  const { session } = useSession();
  const { intendedForMe } = useMessage();
  const mStyles = useStyles();

  const toggleVideo = React.useCallback(
    () => {
      setHasVideo((prevVideo) => !prevVideo);
    },
    []
  )

  const toggleAudio = React.useCallback(
    () => {
      setHasAudio((prevAudio) => !prevAudio);
    },
    []
  );

  function handleHangupClick () {
    if (unpublish && publisher) unpublish(publisher);
  }
  
  const handleStreamPropertyChanged = React.useCallback(
    ({ stream: changedStream, newValue, changedProperty }) => {
      if (publisher) {
        const { connection: targetConnection } = changedStream;
        const { connection: myConnection } = session;
        console.log("[Townhall][VideoControl][handleStreamPropertyChanged] Target Connection", targetConnection);
        console.log("[Townhall][VideoControl][handleStreamPropertyChanged] My Connection", myConnection);
        
        if (targetConnection.connectionId === myConnection.connectionId) {
          if (publisher.stream.streamId === changedStream.streamId) {
            if (changedProperty === "hasAudio") setHasAudio(newValue);
            else if(changedProperty === "hasVideo") setHasVideo(newValue);
          }
        }
      }
    },
    [publisher, session]
  );

  const forceAudioListener = React.useCallback(
    ({ data }) => {
      if( intendedForMe({ data })) toggleAudio();
    },
    [intendedForMe, toggleAudio]
  );

  const forceVideoListener = React.useCallback(
    ({ data }) => {
      if (intendedForMe({ data })) toggleVideo();
    },
    [intendedForMe, toggleVideo]
  );
  
  React.useEffect(
    () => {
      if (session) session.on("streamPropertyChanged", handleStreamPropertyChanged);
      if (session) session.on("signal:force-audio", forceAudioListener);
      if (session) session.on("signal:force-video", forceVideoListener);
      
      return function cleanup() {
        if (session) session.off("streamPropertyChanged", handleStreamPropertyChanged);
        if (session) session.off("signal:force-audio", forceAudioListener);
        if (session) session.off("signal:force-video", forceVideoListener);
      }
    },
    [ 
      session, 
      handleStreamPropertyChanged, 
      forceVideoListener,
      forceAudioListener 
    ]
  )

  React.useEffect(
    () => {
      if(publisher) publisher.publishAudio(hasAudio);
    },
    [hasAudio, publisher]
  )

  React.useEffect(
    () => {
      if(publisher) publisher.publishVideo(hasVideo);
    },
    [hasVideo, publisher]
  );

  if (!publisher) {
    return null;
  } else {
    return(
      <div className={mStyles.root}>
        {children}
        <ControlButton.CycleCamera
          publisher={publisher}
          style={{ marginRight: 8 }}
        />
        <ControlButton.Video
          hasVideo={hasVideo} 
          onClick={toggleVideo}
          style={{ marginRight: 8 }}
        />
        <ControlButton.Mute 
          hasAudio={hasAudio} 
          onClick={toggleAudio}
          style={{ marginRight: 8 }}
        />
        <ControlButton.Hangup onClick={handleHangupClick} />
      </div>
    )
  }
}

VideoControl.defaultProps = { sizeMultiplier: 1 }
export default VideoControl;