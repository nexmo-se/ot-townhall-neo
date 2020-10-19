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

interface ISessionContext{
  connected: boolean;
  session: Session;
  connections: Connection[];
  subscribers: Subscriber[];
  streams: Stream[];
  connectWithCredential: (credential: Credential) => Promise<Session>;
  addStream: ({ stream: Stream }) => void;
  removeStream: ({ stream: Stream }) => void;
}

interface ISessionProvider{
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

export default function SesisonProvider({ 
  children, 
  subscriberContainer = {
    camera: "cameraContainer",
    screen: "cameraContainer",
    moderator: "moderatorContainer",
    custom: "cameraContainer"
  }
}: ISessionProvider){
  const [ connected, setConnected ] = React.useState<boolean>(false);
  const [ connections, setConnections ] = React.useState<Connection[]>([]);
  const [ subscribers, setSubscribers ] = React.useState<Subscriber[]>([]);
  const [ streams, setStreams ] = React.useState<Stream[]>([]);
  const sessionRef = React.useRef<Session>();

  const subscribe = React.useCallback(async (stream: Stream) => {
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
  }, [
    subscriberContainer.camera,
    subscriberContainer.screen,
    subscriberContainer.moderator,
    subscriberContainer.custom
  ])

  const unsubscribe = React.useCallback((stream) => {
    setSubscribers((prev) => {
      return prev.filter((prevSubscriber) => {
        console.log(prevSubscriber, stream.id);
        if(prevSubscriber.id === null) return false;
        else if(prevSubscriber.stream.id === stream.id) return false;
        else return true;
      })
    })
  }, [])

  const connectionCreatedListener = React.useCallback(({ connection }) => {
    setConnections((prev) => [ ...prev, connection ]);
  }, [])

  const connectionDestroyedListener = React.useCallback(({ connection }) => {
    setConnections((prev) => prev.filter((prevConnection) => prevConnection.id !== connection.id));
  }, [])

  const streamCreatedListener = React.useCallback(({ stream }) => {
    subscribe(stream);
    setStreams((prev) => [ ...prev, stream ]);
  }, [ subscribe ])

  const streamDestroyedListener = React.useCallback(({ stream }) => {
    unsubscribe(stream);
    setStreams((prev) => prev.filter((prevStream) => prevStream.id !== stream.id));
  }, [ unsubscribe ]);

  function addStream({ stream }){
    setStreams((prev) => [ ...prev, stream ]);
  }

  function removeStream({ stream }){
    setStreams((prev) => prev.filter((prevStream) => prevStream.id !== stream.id));
  }

  const connectWithCredential = React.useCallback(async (credential: Credential) => {
    if(!sessionRef.current){
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
    }else return sessionRef.current;
  }, [ connectionCreatedListener, connectionDestroyedListener, streamCreatedListener, streamDestroyedListener ]);

  
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
// import React from "react";
// import { v4 as uuid } from "uuid";
// import OT, { Publisher, Session, Stream, Connection, Subscriber } from "@opentok/client";
// import type { Node } from "react";

// import Credential from "entities/credential";
// import User from "entities/user";

// interface ISubscriberContainer {
//   camera: string;
//   moderator: string;
//   screen: string;
//   custom: string;
// }

// interface ISessionProvider { children: Node; }
// interface IStream { stream: Stream }
// interface IGetContainerID {
//   user: User;
//   videoType: string;
// }

// interface ISessionContext {
//   connected: boolean;
//   session?: Session;
//   connections: Array<Connection>;
//   subscribers: Array<Subscriber>;
//   streams: Array<Stream>;
//   connectWithCredential: (credential: Credential) => Promise<Session>;
//   addStream: (args: IStream) => void;
//   removeStream: (args: IStream) => void;
// }

// export const SessionContext = React.createContext<ISessionContext>({
//   connected: false,
//   session: undefined,
//   connections: [],
//   streams: [],
//   subscribers: [],
//   connectWithCredential: (credential: Credential) => Promise.resolve(),
//   addStream: (args: IStream) => {},
//   removeStream: (args: IStream) => {},
// });

// function SessionProvider({ children }: ISessionProvider){
//   const [ subscribers, setSubscribers ] = React.useState<Array<Subscriber>>([]);
//   const [ connected, setConnected ] = React.useState<boolean>(false);
//   const [ connections, setConnections ] = React.useState<Array<Connection>>([]);
//   const [ streams, setStreams ] = React.useState<Array<Stream>>([]);
//   const [ subscriberContainer, setSubscriberContainer ] = React.useState<ISubscriberContainer>({
//     camera: "cameraContainer",
//     moderator: "moderatorContainer",
//     screen: "cameraContainer",
//     custom: "cameraContainer"
//   });
//   const sessionRef = React.useRef<Session>();

//   async function subscribe(stream: Stream){
//     function getContainerID({ user, videoType }: IGetContainerID){
//       if(user.role === "moderator" && videoType === "camera") return subscriberContainer.moderator ?? "moderatorContainer";
//       else if(user.role === "moderator" && videoType === "screen") return subscriberContainer.screen ?? "cameraContainer";
//       else if(user.role === "moderator" && videoType === "custom") return subscriberContainer.screen ?? "cameraContainer";
//       else if(videoType === "camera") return subscriberContainer.camera ?? "cameraContainer";
//       else if(videoType === "screen") return subscriberContainer.screen ?? "cameraContainer";
//       else return subscriberContainer.custom ?? "cameraContainer";
//     } 
//     const { connection, videoType } = stream;
//     const user = User.fromConnection(connection);
//     const data = JSON.parse(connection.data);
//     const containerID = getContainerID({ user, videoType });
//     console.log(containerID);
    
//     const extraData = (data.role === "moderator")? { width: "100%", height: "100%" }: {};
//     const finalOptions = Object.assign({}, extraData, { 
//       insertMode: "append",
//       style: { 
//         buttonDisplayMode: "off",
//         nameDisplayMode: "on"
//       }
//     });
//     const subscriber = await new Promise((resolve, reject) => {
//       if(sessionRef.current){
//         const subscriber = sessionRef.current.subscribe(stream, containerID, finalOptions, (err) => {
//           if(err) reject(err);
//           else resolve(subscriber);
//         });
//       }else reject();
//     });
//     setSubscribers((prev) => [ ...prev, subscriber ]);
//   };

//   const unsubscribe = React.useCallback((stream) => {
//     setSubscribers((prev) => {
//       return prev.filter((prevSubscriber) => prevSubscriber.stream.id === stream.id)
//     })
//   }, [])

//   function connectionCreatedListener({ connection }){
//     setConnections((prev) => [ ...prev, connection ]);
//   }

//   function connectionDestroyedListener({ connection }){
//     setConnections((prev) => prev.filter((prevConnection) => prevConnection.id !== connection.id));
//   }

//   function streamCreatedListener({ stream }){
//     subscribe(stream);
//     setStreams((prev) => [ ...prev, stream ]);
//   }

//   function streamDestroyedListener({ stream }){
//     setStreams((prev) => prev.filter((prevStream) => prevStream.id !== stream.id));
//   }

//   function addStream({ stream }){
//     setStreams((prev) => [ ...prev, stream ]);
//   }

//   function removeStream({ stream }){
//     setStreams((prev) => prev.filter((prevStream) => prevStream.id !== stream.id));
//   }

//   async function connectWithCredential (credential: Credential){
//     if(!sessionRef.current){
//       setConnected(false);
//       sessionRef.current = OT.initSession(credential.apiKey, credential.sessionId);
//       sessionRef.current.on("connectionCreated", connectionCreatedListener);
//       sessionRef.current.on("connectionDestroyed", connectionDestroyedListener);
//       sessionRef.current.on("streamCreated", streamCreatedListener);
//       sessionRef.current.on("streamDestroyed", streamDestroyedListener);
      
//       await new Promise((resolve, reject) => {
//         sessionRef.current.connect(credential.token, (err) => {
//           if(err) reject(err);
//           else resolve();
//         });
//       });
//       setConnected(true);
//       return sessionRef.current;
//     }else return sessionRef.current;
//   };

//   return (
//     <SessionContext.Provider value={{
//       subscribers,
//       connected,
//       connections,
//       streams,
//       session: sessionRef.current,
//       connectWithCredential,
//       addStream,
//       removeStream
//     }}>
//       {children}
//     </SessionContext.Provider>
//   )
//   // const [ isConnected, setIsConnected ] = React.useState<boolean>(false);
//   // const [ session, setSession ] = React.useState<Session>();
//   // const [ changedStream, setChangedStream ] = React.useState<any>();
//   // const [ streams, setStreams ] = React.useState<Array<Stream>>([]);
//   // const [ connections, setConnections ] = React.useState<Array<Connection>>([]);
//   // const [ publishers, setPublishers ] = React.useState<Array<Publisher>>([]);

//   // function handleStreamPropertyChanged({ stream, changedProperty, newValue, oldValue }){
//   //   console.log("[Townhall][SessionProvider][handleStreamPropertyChanged] Stream", stream);
    
//   //   setChangedStream({ stream, changedProperty, newValue, oldValue, token: uuid() });
//   // }

//   // function handleConnectionCreated({ connection }){
//   //   setConnections((prevConnections) => [ ...prevConnections, connection ]);
//   // }

//   // function handleConnectionDestroyed({ connection }){
//   //   setConnections((prevConnections) => {
//   //     return prevConnections.filter((prevConnection) => {
//   //       return prevConnection.id !== connection.id;
//   //     })
//   //   })
//   // }

//   // const handleStreamCreated = React.useCallback(({ stream }) => {
//   //   addStream(stream);
//   // }, [])

//   // const handleStreamDestroyed = React.useCallback(({ stream }) => {
//   //   removeStream(stream);
//   // }, [])

//   // const connect = React.useCallback(async (credential: Credential): Promise<any> => {
//   //   try{
//   //     const session = OT.initSession(credential.apiKey, credential.sessionId);
//   //     session.on("streamPropertyChanged", handleStreamPropertyChanged);
//   //     session.on("streamCreated", handleStreamCreated);
//   //     session.on("streamDestroyed", handleStreamDestroyed);
//   //     session.on("connectionCreated", handleConnectionCreated);
//   //     session.on("connectionDestroyed", handleConnectionDestroyed);
      
//   //     await new Promise((resolve, reject) => {
//   //       session.connect(credential.token, (err) => {
//   //         if(err) reject(err);
//   //         else resolve();
//   //       })
//   //     });
//   //     setSession(session);
//   //     setIsConnected(true);
//   //   }catch(err){
//   //     setIsConnected(false);
//   //     throw err;
//   //   }
//   // }, [ handleStreamCreated, handleStreamDestroyed ]);

//   // const publish = React.useCallback(({ containerID, options }: IPublish) => {
//   //   if(session){
//   //     const publisher = session.publish(containerID, options);
//   //     setPublishers((prev) => [ ...prev, publisher ]);
//   //     return publisher
//   //   }else throw new Error("No Session!");
//   // }, [ session ]);

//   // function unpublish(publisher:Publisher):void{
//   //   if(session){
//   //     session.unpublish(publisher);
//   //     setPublishers((prev) => prev.filter((pub) => pub.id !== publisher.id));
//   //   }
//   // }
  
//   // function addStream(stream:Stream):void{
//   //   setStreams((prevStreams) => [ ...prevStreams, stream]);
//   // }
  
//   // function removeStream(stream:Stream):void{
//   //   setStreams((prevStreams) => {
//   //     return prevStreams.filter((prevStream) => {
//   //       return prevStream.id !== stream.id
//   //     })
//   //   })
//   // }

//   // return (
//   //   <SessionContext.Provider value={{
//   //     connect,
//   //     session,
//   //     changedStream,
//   //     isConnected,
//   //     streams,
//   //     addStream,
//   //     removeStream,
//   //     connections,
//   //     publish,
//   //     unpublish,
//   //     publishers
//   //   }}>
//   //     {children}
//   //   </SessionContext.Provider>
//   // )
// }
// export default SessionProvider