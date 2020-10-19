// @flow
import React from "react";
import OT from "@opentok/client";
import User from "entities/user";
import useSession from "hooks/session";
import { Session, Publisher } from "@opentok/client";

interface IUnpublish { session: Session }
interface IPublish{
  session: Session;
  user: User;
  extraData?: any;
  onAccessDenied?: (user: User) => void
}

interface IReturnValue {
  publish: (args: IPublish) => Promise<Publisher>;
  unpublish: (args: IUnpublish) => Promise<void>;
  publisher?: Publisher;
}

interface IPublisher{
  containerID: string;
  autoLayout?: boolean;
  name?: string;
}

function usePublisher({ containerID, autoLayout = true, name }: IPublisher): IReturnValue{
  const { addStream, removeStream } = useSession();
  const publisherRef = React.useRef();

  const streamCreatedListener = React.useCallback(({ stream }) => {
    addStream({ stream });
  }, [ addStream ])

  const streamDestroyedListener = React.useCallback(({ stream }) => {
    removeStream({ stream });
  }, [ removeStream ])

  const publish = React.useCallback(async ({ session, user, extraData }: IPublish): Promise<Publisher> => {
    if(!publisherRef.current){
      const options = { 
        insertMode: "append",
        name: name? name: user.name,
        style: { 
          buttonDisplayMode: "off",
          nameDisplayMode: "on"
        }
      };
      const finalOptions = Object.assign({}, options, extraData);
      publisherRef.current = OT.initPublisher(containerID, finalOptions);
      if(publisherRef.current) publisherRef.current.on("streamCreated", streamCreatedListener);
      if(publisherRef.current) publisherRef.current.on("streamDestroyed", streamDestroyedListener);

      await new Promise((resolve, reject) => {
        session.publish(publisherRef.current, (err) => {
          if(err) reject(err);
          else resolve();
        })
      })
      return publisherRef.current;
    }else return publisherRef.current;
  }, [ containerID, name, streamCreatedListener, streamDestroyedListener ]);

  const unpublish =  React.useCallback(async ({ session }: IUnpublish) => {
    if(publisherRef.current) {
      await session.unpublish(publisherRef.current);
      publisherRef.current = undefined;
    }
  }, []);

  return { 
    publisher: publisherRef.current,
    publish,
    unpublish
  }

  // const [ publisher, setPublisher ] = React.useState<Publisher>();
  // const [ user, setUser ] = React.useState<User | void>();
  // const [ stream, setStream ] = React.useState<Stream>();
  // const [ layoutManager ] = React.useState<LayoutManager>(new LayoutManager(containerID));
  // const [ onAccessDenied, setOnAccessDenied ] = React.useState<Function|void>();
  // const mSession = useSession();

  // function handleDestroyed(){
  //   setPublisher(undefined);
  // }

  // const handleStreamCreated = React.useCallback(({ stream }) => {
  //   setStream(stream);
  //   FetchHelper.fetch(mSession.addStream, undefined, stream);
  // }, [ mSession.addStream ])

  // const handleStreamDestroyed = React.useCallback(({ stream }) => {
  //   setStream(null);
  //   FetchHelper.fetch(mSession.removeStream, undefined, stream);
  // }, [ mSession.removeStream])

  // const handleAccessDenied = React.useCallback(() =>{
  //   alert("Please enable camera and microphone access to continue. Refresh the page when you are done.");
  //   if(onAccessDenied) onAccessDenied();
  // }, [ onAccessDenied ])

  // async function unpublish(){
  //   if(publisher) mSession.unpublish(publisher);
  //   else throw new Error("Cannot unpublish. No publisher found");
  //   layoutManager.layout();
  // }

  // const publish = React.useCallback(async ({ user, extraData, onAccessDenied }: IPublish) => {
  //   setOnAccessDenied(onAccessDenied);
  //   if(!mSession.session) throw new Error("You are not connected to session");

  //   const options = { 
  //     insertMode: "append",
  //     name: user.name,
  //     style: { 
  //       buttonDisplayMode: "off",
  //       nameDisplayMode: displayName? "on": "off"
  //     }
  //   };
  //   const finalOptions = Object.assign({}, options, extraData);
  //   const publisher: Publisher = await FetchHelper.fetch(mSession.publish, undefined, { containerID, options: finalOptions });
  //   publisher.on("destroyed", handleDestroyed);
  //   publisher.on("streamCreated", handleStreamCreated);
  //   publisher.on("streamDestroyed", handleStreamDestroyed);
  //   publisher.on("accessDenied", handleAccessDenied);
  //   setPublisher(publisher);
  //   setUser(user);
  // }, [ containerID, displayName, handleAccessDenied, handleStreamCreated, handleStreamDestroyed, mSession.session, mSession.publish ])

  // React.useEffect(() => {
  //   try{
  //     if(autoLayout && stream && publisher) {
  //       const { videoType } = stream;
  //       const element = document.getElementById(publisher.id);
  //       if(element && videoType === "screen") element.classList.add("OT_big");
  //       if(element && user && user.role === "vod") element.classList.add("OT_big");
  //     }
  //     layoutManager.layout();
  //   }catch(err){
  //     console.log(err.stack);
  //   }
  // }, [ publisher, stream, autoLayout, layoutManager, user ])

  // return { 
  //   unpublish, 
  //   publish, 
  //   publisher, 
  //   stream,
  //   layoutManager
  // }
}
export default usePublisher;