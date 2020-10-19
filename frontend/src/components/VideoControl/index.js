// @flow
import React from "react";
import type { Node } from "react";

import useStyles from "./styles";
import useSession from "hooks/session";
import useMessage from "hooks/message";
import { Publisher } from "@opentok/client";

import HangupButton from "components/HangupButton";
import MuteButton from "components/MuteButton";
import VideoButton from "components/VideoButton";

interface IVideoControl {
  sizeMultiplier?: number;
  publisher?: Publisher;
  unpublish?: Function;
  children?: Node
}

function VideoControl({ sizeMultiplier=1, publisher, unpublish, children }: IVideoControl){
  const [ hasAudio, setHasAudio ] = React.useState(true);
  const [ hasVideo, setHasVideo ] = React.useState(true);
  const { session } = useSession();
  const { intendedForMe } = useMessage();
  const mStyles = useStyles();

  const toggleVideo = React.useCallback(() => {
    setHasVideo((prevVideo) => !prevVideo);
  }, [])

  const toggleAudio = React.useCallback(() => {
    setHasAudio((prevAudio) => !prevAudio);
  }, []);

  function handleHangupClick(){
    if(unpublish && publisher) unpublish(publisher);
  }
  
  const handleStreamPropertyChanged = React.useCallback(({ stream: changedStream, newValue, changedProperty }) => {
    if(publisher){
      const { connection: targetConnection } = changedStream;
      const { connection: myConnection } = session;
      console.log("[Townhall][VideoControl][handleStreamPropertyChanged] Target Connection", targetConnection);
      console.log("[Townhall][VideoControl][handleStreamPropertyChanged] My Connection", myConnection);
      
      if(targetConnection.connectionId === myConnection.connectionId){
        if(publisher.stream.streamId === changedStream.streamId){
          if(changedProperty === "hasAudio") setHasAudio(newValue);
          else if(changedProperty === "hasVideo") setHasVideo(newValue);
        }
      }
    }
  }, [ publisher, session ]);

  const forceAudioListener = React.useCallback(({ data }) => {
    if(intendedForMe({ data })) toggleAudio();
  }, [ intendedForMe, toggleAudio ]);

  const forceVideoListener = React.useCallback(({ data }) => {
    if(intendedForMe({ data })) toggleVideo();
  }, [ intendedForMe, toggleVideo ]);
  
  React.useEffect(() => {
    if(session) session.on("streamPropertyChanged", handleStreamPropertyChanged);
    if(session) session.on("signal:force-audio", forceAudioListener);
    if(session) session.on("signal:force-video", forceVideoListener);
    return function cleanup(){
      if(session) session.off("streamPropertyChanged", handleStreamPropertyChanged);
      if(session) session.off("signal:force-audio", forceAudioListener);
      if(session) session.off("signal:force-video", forceVideoListener);
    }
  }, [ 
    session, 
    handleStreamPropertyChanged, 
    forceVideoListener,
    forceAudioListener 
  ])

  React.useEffect(() => {
    if(publisher) publisher.publishAudio(hasAudio);
  }, [ hasAudio, publisher ])

  React.useEffect(() => {
    if(publisher) publisher.publishVideo(hasVideo);
  }, [ hasVideo, publisher ]);

  if(!publisher) return null;
  return(
    <div className={mStyles.root}>
      {children}
      <VideoButton 
        hasVideo={hasVideo} 
        onClick={toggleVideo}
        style={{ marginRight: 8 }}
      />
      <MuteButton 
        hasAudio={hasAudio} 
        onClick={toggleAudio}
        style={{ marginRight: 8 }}
      />
      <HangupButton onClick={handleHangupClick} />
    </div>
  )
}

VideoControl.defaultProps = { sizeMultiplier: 1 }
export default VideoControl;