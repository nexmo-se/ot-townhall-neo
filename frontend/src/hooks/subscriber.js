// @flow
import React from "react";
import User from "entities/user";
import LayoutManager from "utils/layout-manager";
import useSession from "hooks/session";
import { Stream, Subscriber } from "@opentok/client";

type ISubscriber = {
  moderator: string,
  camera: string,
  screen: string,
  custom?: string
}

function useSubscriber({ moderator, screen, camera, custom }: ISubscriber){
  const [ subscribed, setSubscribed ] = React.useState<Array<Stream>>([]);
  const [ subscribers, setSubscribers ] = React.useState<Array<Subscriber>>([]);
  const [ cameraLayout ] = React.useState<LayoutManager>(new LayoutManager(camera));
  const [ screenLayout ] = React.useState<LayoutManager>(new LayoutManager(screen));
  const mSession = useSession();

  function getContainerId(user:User, videoType:string){
    console.log(user);
    if(user.role === "moderator" && videoType === "camera") return moderator;
    else if(user.role === "moderator" && videoType === "screen") return screen;
    else if(user.role === "moderator" && videoType === "custom") return screen;
    else if(videoType === "camera") return camera;
    else if(videoType === "screen") return screen;
    else return custom;
  }

  async function subscribe(streams:Array<Stream>, moderatorContainer?:string){
    // Do not subscribe my own stream
    const otherStreams = streams.filter((stream) => {
      const { connection: streamConnection } = stream;
      const { connection: myConnection } = mSession.session;
      if(streamConnection.id !== myConnection.id) return true;
      else return false;
    })
    
    setSubscribed(otherStreams);

    const streamIDs = otherStreams.map((stream) => stream.id);
    const subscribedIDs = subscribed.map((stream) => stream.id);

    const newStreams = otherStreams.filter((stream) => !subscribedIDs.includes(stream.id))
    const removedStreams = subscribed.filter((stream) => !streamIDs.includes(stream.id));

    removedStreams.forEach((stream) => {
      setSubscribers((prevSubscribers) => {
        return prevSubscribers.filter((subscriber) => {
          return !!subscriber.stream
        })
      })
    })

    await Promise.all(newStreams.map(async (stream) => {
      const { connection, videoType } = stream;
      const data = JSON.parse(connection.data);
      const containerId = getContainerId(data, videoType);
      const extraData = (data.role === "moderator")? { width: "100%", height: "100%" }: {}
      const finalOptions = Object.assign({}, extraData, { insertMode: "append" });
      const subscriber = await new Promise((resolve, reject) => {
        const subscriber = mSession.session.subscribe(stream, containerId, finalOptions, (err) => {
          if(err) reject(err);
          else resolve(subscriber);
        })        
      });
      setSubscribers((prevSubscribers) => [ ...prevSubscribers, subscriber ]);
    }));
  };

  React.useEffect(() => {
    try{
      subscribers.forEach((subscriber) => {
        const { videoType } = subscriber.stream;
        const element = document.getElementById(subscriber.id);
        if(videoType === "screen" && element) element.classList.add("OT_big");
        if(videoType === "custom" && element) element.classList.add("OT_big");
      })
      cameraLayout.layout();
      screenLayout.layout();
    }catch(err){
      console.log(err.stack);
    }
  }, [ subscribers, cameraLayout, screenLayout ]);

  return { subscribe, subscribers }
}
export default useSubscriber;