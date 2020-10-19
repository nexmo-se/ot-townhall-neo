// @flow
// import React from "react";
// import { SubscriberContext } from "contexts/subscriber";

// export default function useSubscriber(){
//   return React.useContext(SubscriberContext);
// }

// import React from "react";
// import User from "entities/user";
// import LayoutManager from "utils/layout-manager";
// import lodash from "lodash";
// import useSession from "hooks/session";
// import { Session, Stream, Subscriber } from "@opentok/client";

// interface IReturnValue{ subscribers: Array<Subscriber>; }
// interface IGetContainerID {
//   user: User;
//   videoType: string;
// }

// interface ISubscriber {
//   moderator?: string,
//   camera?: string,
//   screen?: string,
//   custom?: string
// }

// function useSubscriber({}: ISubscriber){
//   const [ subscribers, setSubscribers ] = React.useState<Array<Subscriber>>([]);

//   // React.useEffect(() => {
//   //   function getContainerID({ user, videoType }: IGetContainerID){
//   //     if(user.role === "moderator" && videoType === "camera") return moderator;
//   //     else if(user.role === "moderator" && videoType === "screen") return screen;
//   //     else if(user.role === "moderator" && videoType === "custom") return screen;
//   //     else if(videoType === "camera") return camera;
//   //     else if(videoType === "screen") return screen;
//   //     else return custom;
//   //   }

//   //   setSubscribers((prevSubscribers) => {
//   //     const prevStreams = prevSubscribers.map((subscriber) => subscriber.stream);
//   //   })
//   // }, [ mSession.streams ])

//   // const streamCreatedListener = React.useCallback(async ({ stream }) => {
//   //   function getContainerID({ user, videoType }: IGetContainerID){
//   //     if(user.role === "moderator" && videoType === "camera") return moderator;
//   //     else if(user.role === "moderator" && videoType === "screen") return screen;
//   //     else if(user.role === "moderator" && videoType === "custom") return screen;
//   //     else if(videoType === "camera") return camera;
//   //     else if(videoType === "screen") return screen;
//   //     else return custom;
//   //   }

//   //   const { connection, videoType } = stream;
//   //   const data = JSON.parse(connection.data);
//   //   const user = User.fromJSON(data);
//   //   const containerID = getContainerID({ user, videoType });
//   //   const extraData = (data.role === "moderator")? { width: "100%", height: "100%" }: {};
//   //   const finalOptions = Object.assign({}, extraData, { 
//   //     insertMode: "append",
//   //     style: { 
//   //       buttonDisplayMode: "off",
//   //       nameDisplayMode: "on"
//   //     }
//   //   });
//   //   const subscriber = await new Promise((resolve, reject) => {
//   //     const subscriber = session.subscribe(stream, containerID, finalOptions, (err) => {
//   //       if(err) reject(err);
//   //       else resolve(subscriber);
//   //     });
//   //   });
//   //   setSubscribers((prev) => [ ...prev, subscriber ]);
//   //   return subscriber;
//   // }, [ session, camera, custom, moderator, screen ]);

//   // const streamDestroyedListener = React.useCallback(({ stream }) => {
//   //   setSubscribers((prev) => {
//   //     return prev.filter((prevSubscriber) => prevSubscriber.stream.id === stream.id)
//   //   })
//   // }, [])

//   // React.useEffect(() => {
//   //   if(session) session.on("streamCreated", streamCreatedListener);
//   //   if(session) session.on("streamDestroyed", streamDestroyedListener);
//   //   return function cleanup(){
//   //     if(session) session.on("streamCreated", streamCreatedListener);
//   //     if(session) session.on("streamDestroyed", streamDestroyedListener);
//   //   }
//   // }, [ session, streamCreatedListener, streamDestroyedListener ]);

//   return {  subscribers }
// }
// export default useSubscriber;