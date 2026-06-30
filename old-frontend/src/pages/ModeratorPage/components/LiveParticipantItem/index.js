// @flow
import React from "react";
import lodash from "lodash";
import type { Node } from "react";

import clsx from "clsx";
import User from "entities/user";
import { Publisher, Subscriber } from "@opentok/client";

import useStyles from "./styles";
import useMessage from "hooks/message";
import useSession from "hooks/session";
import { useState, useEffect, useCallback } from "react";

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
  onForbidden?: () => {};
}

function LiveParticipantItem (props: LiveParticipantItemProps) {
  const { 
    user, 
    className, 
    publisher,
    subscriber,
    additionalControls,
    onForbidden,
    withAvatar = true
  } = props

  const [hasVideo, setHasVideo] = useState<boolean>(false);
  const [hasAudio, setHasAudio] = useState<boolean>(false);
  const [showHangup, setShowHangup] = useState<boolean>(false);
  const { stream: publisherStream } = publisher ?? { stream: undefined };
  const { stream: subscriberStream } = subscriber ?? { stream: undefined };
  const mStyles = useStyles();
  const mMessage = useMessage();
  const mSession = useSession();

  function toggleVideo () {
    if (publisher) publisher.publishVideo(!hasVideo); // if publisher set, send it thru the stream
    else if (subscriber && hasVideo) {
      const { connection } = subscriber.stream;
      const user = User.fromConnection(connection);

      // Always set it false because we don't want Moderator to 
      // turn on the video remotely
      mMessage.forceVideo({ user, hasVideo: false });
    } else if (subscriber && !hasVideo) {
      // Notify moderator if the ability to turn on audio/video is not possible
      if (onForbidden) onForbidden();
    }
  }

  function toggleAudio () {
    if (publisher) publisher.publishAudio(!hasAudio);
    else if (subscriber && hasAudio) {
      const { connection } = subscriber.stream;
      const user = User.fromConnection(connection);

      // Always set it false because we don't want Moderator to
      // turon on the audio remotely
      mMessage.forceAudio({ user, hasAudio: false });
    } else if (subscriber && !hasAudio) {
      // Notify moderator if the ability to turn on audio/video is not possible
      if (onForbidden) onForbidden();
    }
  }
  // useCallback wont be rerun on useEffect if it changes.
  const streamPropertyListener = useCallback(
    ({ stream, changedProperty, newValue }) => {
      const pubsub = (publisher)? publisher: (subscriber)? subscriber: undefined;
      if (pubsub) {
        const { stream: localStream } = pubsub;
        console.log("StreamPropertyListener:", localStream, changedProperty)
        if(stream.id === localStream.id && changedProperty === "hasAudio") setHasAudio(newValue);
        if(stream.id === localStream.id && changedProperty === "hasVideo") setHasVideo(newValue); 
      }
    },
    [publisher, subscriber]
  )

  useEffect(
    () => {
      // If streamPropertyChanged e.g Video/Audio/Share Run streamPropertyListner
      if (mSession.session) mSession.session.on("streamPropertyChanged", streamPropertyListener);
      return function cleanup () {
        if (mSession.session) mSession.session.off("streamPropertyChanged", streamPropertyListener);
      }
    }, // Anytime these two change, we will rerun the useEffect
    [mSession.session, streamPropertyListener]
  )

  useEffect(
    () => {
      if (publisherStream) {
        setHasAudio(publisherStream.hasAudio);
        setHasVideo(publisherStream.hasVideo);
      } else if (subscriberStream) {
        setHasAudio(subscriberStream.hasAudio);
        setHasVideo(subscriberStream.hasVideo);
      }
    },
    [publisherStream, subscriberStream]
  )

  useEffect(
    () => {
      if (!subscriber) return;
      if (!subscriber.stream) return;

      const connection = lodash(subscriber).get("stream.connection");
      const user = User.fromConnection(connection);
      if (user.role === "presenter") setShowHangup(false);
      else setShowHangup(true);
    },
    [subscriber]
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
            {additionalControls}
            { showHangup && <Hangup subscriber={subscriber} /> }
          </div> 
        </div>
      </div>
    </div>
  )
}
export default LiveParticipantItem;