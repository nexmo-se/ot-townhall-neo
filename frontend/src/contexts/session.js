// @flow
import React from "react";
import Credential from "entities/credential";
import User from "entities/user";
import OT from "@opentok/client";
import type { Session, Connection, Subscriber, Stream } from "@opentok/client";
import type { Node } from "react";

interface IGetContainerID {
  user: User;
  videoType: string;
}

interface ISubscriberContainer{
  camera: string;
  screen: string;
  custom: string;
  moderator: string;
}

interface ISessionContext {
  connected: boolean;
  session: Session;
  connections: Connection[];
  subscribers: Subscriber[];
  streams: Stream[];
  connectWithCredential: (credential: Credential) => Promise<Session>;
  addStream: ({ stream: Stream }) => void;
  removeStream: ({ stream: Stream }) => void;
}

interface ISessionProvider {
  children: Node;
  subscriberContainer?: ISubscriberContainer
}

export const SessionContext = React.createContext<ISessionContext>({
  connected: false,
  session: undefined,
  connections: [],
  subscribers: [],
  streams: [],
  connectWithCredential: (credential: Credential) => Promise.resolve(),
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
}: ISessionProvider) {
  const [ connected, setConnected ] = React.useState<boolean>(false);
  const [ connections, setConnections ] = React.useState<Connection[]>([]);
  const [ subscribers, setSubscribers ] = React.useState<Subscriber[]>([]);
  const [ streams, setStreams ] = React.useState<Stream[]>([]);
  const sessionRef = React.useRef<Session>();

  const subscribe = React.useCallback(
    async (stream: Stream) => {
      function getContainerID({ user, videoType }: IGetContainerID){
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
          nameDisplayMode: "on"
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
    async (credential: Credential) => {
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
