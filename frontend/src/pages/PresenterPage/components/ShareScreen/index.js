// @flow
import React from "react";
import User from "entities/user";

import useSession from "hooks/session";
import usePublisher from "hooks/publisher";
import ShareScreenButton from "components/ShareScreenButton";

function ShareScreen(){
  const [ sharing, setSharing ] = React.useState<boolean>(false);
  const { publisher: screenPublisher, publish, unpublish } = usePublisher({ containerID: "cameraContainer" });
  const { session } = useSession();

  async function handleShareScreenClick(){
    if(session && !sharing){
      const screenUser = new User({ name: "sharescreen", role: "sharescreen" });
      await publish({ 
        session: session, 
        user: screenUser,
        extraData: { videoSource: "screen" }
      });
      setSharing(true);
    }else if(session && sharing){
      await unpublish({ session: session });
      setSharing(false);
    }
  }

  const streamCreatedListener = React.useCallback(() => setSharing(true), []);
  const streamDestroyedListener = React.useCallback(async () => {
    await unpublish({ session: session });
    setSharing(false)
  }, [ session, unpublish ]);

  React.useEffect(() => {
    if(screenPublisher) screenPublisher.on("streamCreated", streamCreatedListener);
    if(screenPublisher) screenPublisher.on("streamDestroyed", streamDestroyedListener);

    return function cleanup(){
      if(screenPublisher) screenPublisher.off("streamCreated", streamCreatedListener);
      if(screenPublisher) screenPublisher.off("streamDestroyed", streamDestroyedListener);
    }
  }, [ screenPublisher, streamCreatedListener, streamDestroyedListener ])


  return (
    <ShareScreenButton 
      style={{ marginRight: 8 }}
      onClick={handleShareScreenClick}
      isSharing={sharing}
    />
  )
}
export default ShareScreen;