import AvatarImage from "assets/img/avatar.png";

import React from "react";
import User from "entities/user";
import OT from "@opentok/client";

export const SessionContext = React.createContext({
  connected: false,
  session: undefined,
  connections: [],
  subscribers: [],
  streams: [],
  connectWithCredential: (credential) => Promise.resolve(),
  addStream: ({ stream: Stream }) => {},
  removeStream: ({ stream: Stream }) => {}
});

export default function SesisonProvider ({ 
  children, 
  subscriberContainer = {
    camera: "cameraContainer",
    screen: "cameraContainer",
    moderator: "moderatorContainer",
    custom: "cameraContainer"
  }
}) {
  const [ connected, setConnected ] = React.useState(false);
  const [ connections, setConnections ] = React.useState([]);
  const [ subscribers, setSubscribers ] = React.useState([]);
  const [ streams, setStreams ] = React.useState([]);
  const sessionRef = React.useRef();

  const subscribe = React.useCallback(
    async (stream) => {
      function getContainerID({ user, videoType }){
        if(user.role === "moderator" && videoType === "camera") return subscriberContainer.moderator ?? "moderatorContainer";
        else if(user.role === "moderator" && videoType === "screen") return subscriberContainer.screen ?? "cameraContainer";
        else if(user.role === "moderator" && videoType === "custom") return subscriberContainer.screen ?? "cameraContainer";
        else if(videoType === "camera") return subscriberContainer.camera ?? "cameraContainer";
        else if(videoType === "screen") return subscriberContainer.screen ?? "cameraContainer";
        else return subscriberContainer.custom ?? "cameraContainer";
      } 

      const { connection, videoType } = stream;
      const user = User.fromConnection(connection);
      const data = JSON.parse(connection.data);
      const containerID = getContainerID({ user, videoType });
      
      const extraData = (data.role === "moderator")? { width: "100%", height: "100%" }: {};
      const finalOptions = Object.assign({}, extraData, { 
        insertMode: "append",
        style: { 
          buttonDisplayMode: "off",
          nameDisplayMode: "on",
          backgroundImageURI: AvatarImage
        }
      });
      const subscriber = await new Promise((resolve, reject) => {
        if(sessionRef.current){
          const subscriber = sessionRef.current.subscribe(stream, containerID, finalOptions, (err) => {
            if(err) reject(err);
            else resolve(subscriber);
          });
        }else reject();
      });
      setSubscribers((prev) => [ ...prev, subscriber ]);
    },
    [
      subscriberContainer.camera,
      subscriberContainer.screen,
      subscriberContainer.moderator,
      subscriberContainer.custom
    ]
  )

  const unsubscribe = React.useCallback(
    (stream) => {
      setSubscribers((prev) => {
        return prev.filter((prevSubscriber) => {
          if(prevSubscriber.id === null) return false;
          else if(prevSubscriber.stream.id === stream.id) return false;
          else return true;
        })
      })
    },
    []
  )

  const connectionCreatedListener = React.useCallback(
    ({ connection }) => {
      setConnections((prev) => [ ...prev, connection ]);
    },
    []
  )

  const connectionDestroyedListener = React.useCallback(
    ({ connection }) => {
      setConnections((prev) => prev.filter((prevConnection) => prevConnection.id !== connection.id));
    },
    []
  )

  const streamCreatedListener = React.useCallback(
    ({ stream }) => {
      if (stream.videoType === "custom") {
        alert("You might not able to see the video due to browser limitation.");
      }

      subscribe(stream);
      setStreams((prev) => [ ...prev, stream ]);
    },
    [subscribe]
  )

  const streamDestroyedListener = React.useCallback(
    ({ stream }) => {
      unsubscribe(stream);
      setStreams((prev) => prev.filter((prevStream) => prevStream.id !== stream.id));
    },
    [unsubscribe]
  );

  function addStream ({ stream }) {
    setStreams((prev) => [ ...prev, stream ]);
  }

  function removeStream ({ stream }) {
    setStreams((prev) => prev.filter((prevStream) => prevStream.id !== stream.id));
  }

  const connectWithCredential = React.useCallback(
    async (credential) => {
      if (!sessionRef.current) {
        setConnected(false);
        sessionRef.current = OT.initSession(credential.apiKey, credential.sessionId);
        sessionRef.current.on("connectionCreated", connectionCreatedListener);
        sessionRef.current.on("connectionDestroyed", connectionDestroyedListener);
        sessionRef.current.on("streamCreated", streamCreatedListener);
        sessionRef.current.on("streamDestroyed", streamDestroyedListener);
        
        await new Promise((resolve, reject) => {
          sessionRef.current.connect(credential.token, (err) => {
            if(err) reject(err);
            else resolve();
          });
        });
        setConnected(true);
        return sessionRef.current;
      } else return sessionRef.current;
    },
    [
      connectionCreatedListener,
      connectionDestroyedListener,
      streamCreatedListener,
      streamDestroyedListener
    ]
  );

  
  return (
    <SessionContext.Provider value={{
      session: sessionRef.current,
      connected,
      connections,
      subscribers,
      streams,
      connectWithCredential,
      addStream,
      removeStream
    }}>
      {children}
    </SessionContext.Provider>
  )
}
