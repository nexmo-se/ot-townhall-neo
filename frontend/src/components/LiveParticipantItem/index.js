// @flow
import React from "react";
import type { Node } from "react";

import clsx from "clsx";
import User from "entities/user";
import { Publisher, Subscriber } from "@opentok/client";

import useStyles from "./styles";
import useSession from "hooks/session";

import Hangup from "./Hangup";
import Avatar from "components/Avatar";
import VideoButton from "components/VideoButton";
import MuteButton from "components/MuteButton";

type Props = {
  user:User,
  className?:any,
  publisher?:Publisher,
  subscriber?:Subscriber,
  additionalControls?:Node
}

function LiveParticipantItem({ user, className, publisher, subscriber, additionalControls }:Props){
  const [ hasVideo, setHasVideo ] = React.useState<boolean>(true);
  const [ hasAudio, setHasAudio ] = React.useState<boolean>(true);
  const mSession = useSession();
  const mStyles = useStyles();

  function handleVideoClick(){
    if(publisher) publisher.publishVideo(!hasVideo);
    else if(subscriber){
      const { connection } = subscriber.stream;
      const data = JSON.parse(connection.data);
      const user = User.fromJSON(data);
      user.id = connection.id;

      const payload = Object.assign({}, user.toJSON(), { hasVideo: !hasVideo })
      mSession.session.signal({
        type: "force-video",
        data: JSON.stringify(payload)
      })
    }
  }

  function handleAudioClick(){
    if(publisher) publisher.publishAudio(!hasAudio);
    else if(subscriber){
      const { connection } = subscriber.stream;
      const data = JSON.parse(connection.data);
      const user = User.fromJSON(data);
      user.id = connection.id;

      const payload = Object.assign({}, user.toJSON(), { hasAudio: !hasAudio })
      mSession.session.signal({
        type: "force-audio",
        data: JSON.stringify(payload)
      })
    }
  }

  const retrieveStreamManager = React.useCallback(() => {
    if(publisher) return publisher;
    else if(subscriber) return subscriber;
    else return undefined;
  }, [ publisher, subscriber ]);
  
  const handleStreamPropertyChanged = React.useCallback(({ stream: targetStream, newValue, changedProperty }) => {
    const streamManager = retrieveStreamManager();
    console.log("[Townhall][LiveParticipantItem][handleStreamPropertyChanged] Stream Manager", streamManager);
    
    if(streamManager){
      const { stream: myStream } = streamManager;
      const { connection: targetConnection } = targetStream;
      const { connection: myConnection } = myStream;
      console.log("[Townhall][LiveParticipantItem][handleStreamPropertyChanged] Target Connection", targetConnection);
      console.log("[Townhall][LiveParticipantItem][handleStreamPropertyChanged] My Connection", myConnection);
      console.log("[Townhall][LiveParticipantItem][handleStreamPropertyChanged] Target Stream", targetStream);
      console.log("[Townhall][LiveParticipantItem][handleStreamPropertyChanged] My Stream", myStream);
      
      if(targetConnection.connectionId === myConnection.connectionId){
        if(targetStream.streamId === myStream.streamId){
          if(changedProperty === "hasAudio") setHasAudio(newValue);
          else if(changedProperty === "hasVideo") setHasVideo(newValue);
        }
      }
    }
  }, [ retrieveStreamManager ])
  
  React.useEffect(() => {
    const { session } = mSession;
    if(session) session.on("streamPropertyChanged", handleStreamPropertyChanged);
    return function cleanup(){
      if(session) session.off("streamPropertyChanged", handleStreamPropertyChanged);
    }
  }, [ mSession.session, publisher, subscriber, handleStreamPropertyChanged, mSession ])

  React.useEffect(() => {
    const streamManager = retrieveStreamManager();
    console.log("[Townhall][ParticipantListItem] Stream Manager", streamManager);
    if(streamManager && streamManager.stream){
      const { hasAudio, hasVideo } = streamManager.stream;
      setHasAudio(hasAudio);
      setHasVideo(hasVideo);
    }
  }, [ publisher, subscriber, retrieveStreamManager ])

  return (
    <div 
      className={clsx(
        "Vlt-card Vlt-card--plain Vlt-bg-aqua-lighter Vlt-card--lesspadding",
        className
      )}
      style={{ marginTop: 8, marginBottom: 4 }}
    >
      <div className="Vlt-card__content" style={{ display: "flex", flexDirection: "row" }}>
        <Avatar user={user} size={60} className={mStyles.avatar} />
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 200  }}>
          <p><b>{user.name}</b></p>   
          <div style={{ display: "flex", flexDirection: "row" }}>
            {additionalControls}
            <VideoButton 
              size={32} 
              fontSize={16} 
              style={{ marginRight: 8 }} 
              onClick={handleVideoClick}
              hasVideo={hasVideo}
            />
            <MuteButton 
              size={32} 
              fontSize={16} 
              style={{ marginRight: 8 }} 
              onClick={handleAudioClick}
              hasAudio={hasAudio}
            />
            <Hangup subscriber={subscriber} />
          </div> 
        </div>
      </div>
    </div>
  );
}
export default LiveParticipantItem;