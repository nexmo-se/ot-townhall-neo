// @flow
import React from "react";
import User from "entities/user";

import useSession from "hooks/session";
import usePublisher from "hooks/publisher";
import ShareScreenButton from "components/ShareScreenButton";

function ShareScreen(){
  const { session } = useSession();
  const { publisher: screenPublisher, unpublish, publish: publishScreen } = usePublisher({ containerID: "cameraContainer" });

  function handleShareScreenClick(){
    console.log(screenPublisher);
    if(session && !screenPublisher?.stream){
      publishScreen({
        session,
        user: new User({ name: "sharescreen", role: "sharescreen" }),
        extraData: { videoSource: "screen", width: "100%", height: "100%" }
      })
    }else if(session && screenPublisher?.stream) unpublish({ session });
  }

  return (
    <ShareScreenButton 
      style={{ marginRight: 8 }}
      onClick={handleShareScreenClick}
      isSharing={screenPublisher && screenPublisher.stream}
    />
  )
}
export default ShareScreen;