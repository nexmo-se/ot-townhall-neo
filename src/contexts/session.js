// @flow
import React from "react";
import { v4 as uuid } from "uuid";
import OT, { Publisher, Session, Stream, Connection } from "@opentok/client";
import type { Node } from "react";

import Credential from "entities/credential";

type ProviderProps = { children: Node }
type ChangedStream = {
  stream: Stream, 
  changedProperty: string,
  newValue: boolean,
  oldValue: boolean,
  token: string
}

type ContextProps = {
  connect: (credential: Credential) => Promise<any>,
  publish: (containerID: string, options:any) => Publisher,
  unpublish: (publisher: Publisher) => void,
  session: Session,
  changedStream: ChangedStream,
  isConnected: boolean,
  streams: Array<Stream>,
  connections: Array<Connection>,
  publishers: Array<Publisher>
}

export const SessionContext = React.createContext<ContextProps>({});
function SessionProvider({ children }:ProviderProps){
  const [ isConnected, setIsConnected ] = React.useState<boolean>(false);
  const [ session, setSession ] = React.useState<Session>();
  const [ changedStream, setChangedStream ] = React.useState<any>();
  const [ streams, setStreams ] = React.useState<Array<Stream>>([]);
  const [ connections, setConnections ] = React.useState<Array<Connection>>([]);
  const [ publishers, setPublishers ] = React.useState<Array<Publisher>>([]);

  function handleStreamPropertyChanged({ stream, changedProperty, newValue, oldValue }){
    setChangedStream({ stream, changedProperty, newValue, oldValue, token: uuid() });
  }

  function handleConnectionCreated({ connection }){
    setConnections((prevConnections) => [ ...prevConnections, connection ]);
  }

  function handleConnectionDestroyed({ connection }){
    setConnections((prevConnections) => {
      return prevConnections.filter((prevConnection) => {
        return prevConnection.id !== connection.id;
      })
    })
  }

  function handleStreamCreated({ stream }){
    setStreams((prevStreams) => [ ...prevStreams, stream]);
  }

  function handleStreamDestroyed({ stream }){
    setStreams((prevStreams) => {
      return prevStreams.filter((prevStream) => {
        return prevStream.id !== stream.id
      })
    })
  }

  async function connect(credential:Credential):Promise<any>{
    try{
      const session = OT.initSession(credential.apiKey, credential.sessionId);
      
      session.on("streamPropertyChanged", handleStreamPropertyChanged);
      session.on("streamCreated", handleStreamCreated);
      session.on("streamDestroyed", handleStreamDestroyed);
      session.on("connectionCreated", handleConnectionCreated);
      session.on("connectionDestroyed", handleConnectionDestroyed);
      
      await new Promise((resolve, reject) => {
        session.connect(credential.token, (err) => {
          if(err) reject(err);
          else resolve();
        })
      });
      setSession(session);
      setIsConnected(true);
    }catch(err){
      console.log(err);
      setIsConnected(false);
    }
  }

  function publish(containerID:string, options:any):Publisher{
    if(session){
      const publisher = session.publish(containerID, options);
      setPublishers((prev) => [ ...prev, publisher ]);
      return publisher
    }
  }

  function unpublish(publisher:Publisher):void{
    if(session){
      session.unpublish(publisher);
      setPublishers((prev) => prev.filter((pub) => pub.id !== publisher.id));
    }
  }

  return (
    <SessionContext.Provider value={{
      connect,
      session,
      changedStream,
      isConnected,
      streams,
      connections,
      publish,
      unpublish,
      publishers
    }}>
      {children}
    </SessionContext.Provider>
  )
}
export default SessionProvider