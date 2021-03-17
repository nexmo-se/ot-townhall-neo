// @flow
import React from "react";
import type { Node } from "react";

import clsx from "clsx";
import User from "entities/user";
import { Publisher, Subscriber } from "@opentok/client";

import useStyles from "./styles";
import useMessage from "hooks/message";
import useSession from "hooks/session";

import Hangup from "./components/Hangup";
import Avatar from "components/Avatar";
import ControlButton from "components/ControlButton";

interface LiveParticipantItemProps {
  user: User;
  className?: any;
  publisher?: Publisher;
  subscriber?: Subscriber;
  additionalControls?: Node;
  withAvatar?: boolean;
}

function LiveParticipantItem (props: LiveParticipantItemProps) {
  const { 
    user, 
    className, 
    publisher,
    subscriber, 
    additionalControls,
    withAvatar = true
  } = props

  const [hasVideo, setHasVideo] = React.useState<boolean>(true);
  const [hasAudio, setHasAudio] = React.useState<boolean>(true);
  const mStyles = useStyles();
  const mMessage = useMessage();
  const mSession = useSession();

  function toggleVideo(){
    if (publisher) publisher.publishVideo(!hasVideo);
    else if (subscriber) {
      const { connection } = subscriber.stream;
      const user = User.fromConnection(connection);
      mMessage.forceVideo({ user, hasVideo: !hasVideo })
    }
  }

  function toggleAudio () {
    if (publisher) publisher.publishAudio(!hasAudio);
    else if (subscriber) {
      const { connection } = subscriber.stream;
      const user = User.fromConnection(connection);
      mMessage.forceAudio({ user, hasAudio: !hasAudio });
    }
  }

  const streamPropertyListener = React.useCallback(
    ({ stream, changedProperty, newValue }) => {
      const pubsub = (publisher)? publisher: (subscriber)? subscriber: undefined;
      if (pubsub) {
        const { stream: localStream } = pubsub;
        if(stream.id === localStream.id && changedProperty === "hasAudio") setHasAudio(newValue);
        if(stream.id === localStream.id && changedProperty === "hasVideo") setHasVideo(newValue); 
      }
    },
    [publisher, subscriber]
  )

  React.useEffect(
    () => {
      if (mSession.session) mSession.session.on("streamPropertyChanged", streamPropertyListener);

      return function cleanup () {
        if (mSession.session) mSession.session.on("streamPropertyChanged", streamPropertyListener);
      }
    },
    [mSession.session, streamPropertyListener]
  )

  return (
    <div 
      className={
        clsx(
          "Vlt-card",
          "Vlt-card--plain",
          "Vlt-bg-aqua-lighter",
          "Vlt-card--lesspadding",
          className
        )
      }
      style={{ marginTop: 8, marginBottom: 4 }}
    >
      <div 
        className="Vlt-card__content" 
        style={{ 
          display: "flex", 
          flexDirection: "row",
          alignItems: "center"
        }}
      >
        { withAvatar && <Avatar size={50} className={mStyles.avatar} user={user} /> }
        <div 
          style={{ 
            display: "flex",
            flexDirection: "column",
          }}
        >
          <p><b>{user.name}</b></p>   
          <div
            style={{ 
              display: "flex", 
              flexDirection: "row",
              flexWrap: "wrap"
            }}
          >
            {additionalControls}
            <ControlButton.Video 
              size={32} 
              fontSize={16} 
              style={{ marginRight: 8 }} 
              onClick={toggleVideo}
              hasVideo={hasVideo}
              disabled={(subscriber || publisher)? false: true}
            />
            <ControlButton.Mute 
              size={32} 
              fontSize={16} 
              style={{ marginRight: 8 }} 
              onClick={toggleAudio}
              hasAudio={hasAudio}
              disabled={(subscriber || publisher)? false: true}
            />
            <Hangup subscriber={subscriber} />
          </div> 
        </div>
      </div>
    </div>
  )
}
export default LiveParticipantItem;