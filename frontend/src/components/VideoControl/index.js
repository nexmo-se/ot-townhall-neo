// @flow
import React from "react";
import { Publisher } from "@opentok/client";
import type { Node } from "react";

import useStyles from "./styles";
import useSession from "hooks/session";
import useMessage from "hooks/message";

import ControlButton from "components/ControlButton";

interface VideoControlProps {
  sizeMultiplier?: number;
  publisher: Publisher;
  unpublish?: any;
  children?: Node
}

function VideoControl ({ sizeMultiplier=1, publisher, unpublish, children }: VideoControlProps) {
  const [hasAudio, setHasAudio] = React.useState<boolean>(publisher.stream?.hasAudio ?? false);
  const [hasVideo, setHasVideo] = React.useState<boolean>(publisher.stream?.hasVideo ?? false);
  const { session } = useSession();
  const { intendedForMe } = useMessage();
  const mStyles = useStyles();

  const toggleVideo = React.useCallback(
    () => {
      setHasVideo(
        (prevVideo) => {
          if (!publisher) return false;

          const newVideo = !prevVideo;
          publisher.publishVideo(newVideo);
          return newVideo;
        }
      );
    },
    [publisher]
  )

  const toggleAudio = React.useCallback(
    () => {
      setHasAudio(
        (prevAudio) => {
          if (!publisher) return false;

          const newAudio = !prevAudio;
          publisher.publishAudio(newAudio);
          return newAudio;
        }
      );
    },
    [publisher]
  );
  
  // TODO: Analyse the method below, if it is not required, remove it
  // const handleStreamPropertyChanged = React.useCallback(
  //   ({ stream: changedStream, newValue, changedProperty }) => {
  //     if (!publisher) return;

  //     const { connection: targetConnection } = changedStream;
  //     const { connection: myConnection } = session;
  //     console.log("[Townhall][VideoControl][handleStreamPropertyChanged] Target Connection", targetConnection);
  //     console.log("[Townhall][VideoControl][handleStreamPropertyChanged] My Connection", myConnection);
      
  //     if (targetConnection.connectionId === myConnection.connectionId) {
  //       if (publisher.stream.streamId === changedStream.streamId) {
  //         if (changedProperty === "hasAudio") setHasAudio(newValue);
  //         else if(changedProperty === "hasVideo") setHasVideo(newValue);
  //       }
  //     }
  //   },
  //   [publisher, session]
  // );

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
      // if (session) session.on("streamPropertyChanged", handleStreamPropertyChanged);
      if (session) session.on("signal:force-audio", forceAudioListener);
      if (session) session.on("signal:force-video", forceVideoListener);
      
      return function cleanup() {
        // if (session) session.off("streamPropertyChanged", handleStreamPropertyChanged);
        if (session) session.off("signal:force-audio", forceAudioListener);
        if (session) session.off("signal:force-video", forceVideoListener);
      }
    },
    [ 
      session, 
      // handleStreamPropertyChanged, 
      forceVideoListener,
      forceAudioListener 
    ]
  );

  React.useEffect(
    () => {
      if (!publisher.stream) return;

      setHasAudio(publisher.stream.hasAudio);
      setHasVideo(publisher.stream.hasVideo);
    },
    [publisher.stream]
  )

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
        {
          publisher && (
            <ControlButton.Hangup
              unpublish={unpublish}
              publisher={publisher}
            />
          )        
        }
      </div>
    )
  }
}

VideoControl.defaultProps = { sizeMultiplier: 1 }
export default VideoControl;