// @flow
import React from "react";
import User from "entities/user";

import useSession from "hooks/session";
import usePublisher from "hooks/publisher";
import ShareScreenButton from "components/ShareScreenButton";

function ShareScreen(props){
  const [ sharing, setSharing ] = React.useState<boolean>(false);
  const { publisher: screenPublisher, publish, unpublish } = usePublisher({ containerID: "cameraContainer" });
  const { session, streams} = useSession();

  async function handleShareScreenClick(videoContentHint = ""){
    if(session && !sharing){
      const screenUser = new User({ name: "", role: "sharescreen" });
      await publish({ 
        session: session, 
        user: screenUser,
        extraData: { videoSource: 'screen',  videoContentHint},
        attempt: 3 // Do not retry
      });
    }else if(session && sharing){
      await unpublish({ session: session });
    }
  }

  React.useEffect(() => {
    if (!streams || !screenPublisher) return
    const myShareStreamFound = streams.find((stream) => screenPublisher.stream && stream.id == screenPublisher.stream.id)
    if (!sharing && myShareStreamFound ) {
      setSharing(true)
    }
    else if (sharing && !myShareStreamFound) {
      setSharing(false)
    }
  }, [streams, screenPublisher])


  return (
    <ShareScreenButton 
      style={{ marginRight: 8 }}
      screenShareClick={handleShareScreenClick}
      isSharing={sharing}
      {...props}
    />
  )
}
export default ShareScreen;