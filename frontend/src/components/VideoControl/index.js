// @flow
import React from "react";
import clsx from "clsx";
import type { Node } from "react";

import useStyles from "./styles";
import useSession from "hooks/session";
import { Publisher } from "@opentok/client";

import HangupButton from "components/HangupButton";
import MuteButton from "components/MuteButton";
import VideoButton from "components/VideoButton";

type Props = {
  sizeMultiplier?:number,
  publisher:Publisher|void,
  children?:Node
}

function VideoControl({ sizeMultiplier=1, publisher, children }:Props){
  const [ hasAudio, setHasAudio ] = React.useState(true);
  const [ hasVideo, setHasVideo ] = React.useState(true);
  const mSession = useSession();
  const mStyles = useStyles();

  function handleVideoClick(){
    setHasVideo((prevVideo) => !prevVideo);
  }

  function handleAudioClick(){
    setHasAudio((prevAudio) => !prevAudio);
  }

  function handleHangupClick(){
    mSession.unpublish(publisher);
  }
  
  function handleStreamPropertyChanged({ stream: changedStream, newValue, changedProperty }){
    if(publisher){
      const { connection: targetConnection } = changedStream;
      const { connection: myConnection } = mSession.session;
      console.log("[Townhall][VideoControl][handleStreamPropertyChanged] Target Connection", targetConnection);
      console.log("[Townhall][VideoControl][handleStreamPropertyChanged] My Connection", myConnection);
      
      if(targetConnection.connectionId === myConnection.connectionId){
        if(publisher.stream.streamId === changedStream.streamId){
          if(changedProperty === "hasAudio") setHasAudio(newValue);
          else if(changedProperty === "hasVideo") setHasVideo(newValue);
        }
      }
    }
  }
  
  React.useEffect(() => {
    const { session } = mSession;
    console.log("[Townhall][VideoControl] Session", session);
    if(session) session.on("streamPropertyChanged", handleStreamPropertyChanged);
    return function cleanup(){
      if(session) session.off("streamPropertyChanged", handleStreamPropertyChanged);
    }
  }, [ mSession.session, publisher ])

  React.useEffect(() => {
    if(publisher) publisher.publishAudio(hasAudio);
  }, [ hasAudio ])

  React.useEffect(() => {
    if(publisher) publisher.publishVideo(hasVideo);
  }, [ hasVideo ]);

  if(!publisher) return null;
  return(
    <div className={mStyles.root}>
      {children}
      <VideoButton 
        hasVideo={hasVideo} 
        onClick={handleVideoClick}
        style={{ marginRight: 8 }}
      />
      <MuteButton 
        hasAudio={hasAudio} 
        onClick={handleAudioClick}
        style={{ marginRight: 8 }}
      />
      <HangupButton onClick={handleHangupClick} />
    </div>
  )
}

VideoControl.defaultProps = { sizeMultiplier: 1 }
export default VideoControl;