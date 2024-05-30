// @flow
import React from "react";
import User from "entities/user";

import useSession from "hooks/session";
import usePublisher from "hooks/publisher";
import useMessage from "hooks/message";
import ShareScreenButton from "components/ShareScreenButton";

function ShareScreen(props){
  const [ sharing, setSharing ] = React.useState<boolean>(false);
  const { publisher: screenPublisher, publish, unpublish } = usePublisher({ containerID: "cameraContainer" });
  const { session, streams} = useSession();
  const { intendedForMe } = useMessage();

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

  const forceUnpublishListener = React.useCallback(
    async ({ data }) => {
      if (intendedForMe({ data })) {
        await unpublish({ session });
      }
    },
    [
      session,
      unpublish,
      intendedForMe
    ]
  )

  React.useEffect(
    () => {
      if (session) session.on("signal:force-unpublish", forceUnpublishListener);
      return function cleanup () {
        if (session) session.off("signal:force-unpublish", forceUnpublishListener);
      }
    },
    [session, forceUnpublishListener]
  )

  React.useEffect(() => {
    if (!streams) return
    const myShareStreamFound = streams.find((stream) => screenPublisher && screenPublisher.stream && stream.id == screenPublisher.stream.id)
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