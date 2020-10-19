// @flow
import React from "react";
import User from "entities/user";
import { Publisher } from "@opentok/client";

import usePublisher from "hooks/publisher";
import useSession from "hooks/session";

import VODButton from "../VODButton";
import RecordButton from "../RecordButton";
import LiveParticipantItem from "../LiveParticipantItem";
import ShareScreenButton from "components/ShareScreenButton";

interface IModeratorParticipantItem {
  user: User,
  publisher: Publisher
}

function ModeratorParticipantItem({ user, publisher }: IModeratorParticipantItem){
  const [ sharing, setSharing ] = React.useState<boolean>(false);
  const mScreenPublisher = usePublisher({ containerID: "cameraContainer" });
  const mSession = useSession();

  async function handleShareScreenClick(){
    if(mSession.session && !mScreenPublisher.publisher){
      const screenUser = new User({ name: "sharescreen", role: "sharescreen" });
      await mScreenPublisher.publish({ 
        session: mSession.session, 
        user: screenUser,
        extraData: { videoSource: "screen" }
      });
    }else if(mSession.session && mScreenPublisher.publisher){
      mScreenPublisher.unpublish({ session: mSession.session });
    }
  }

  const streamCreatedListener = React.useCallback(() => setSharing(true), []);
  const streamDestroyedListener = React.useCallback(() => setSharing(false), []);

  React.useEffect(() => {
    if(mScreenPublisher.publisher) mScreenPublisher.publisher.on("streamCreated", streamCreatedListener);
    if(mScreenPublisher.publisher) mScreenPublisher.publisher.on("streamDestroyed", streamDestroyedListener);

    return function cleanup(){
      if(mScreenPublisher.publisher) mScreenPublisher.publisher.off("streamCreated", streamCreatedListener);
      if(mScreenPublisher.publisher) mScreenPublisher.publisher.off("streamDestroyed", streamDestroyedListener);
    }
  }, [ mScreenPublisher.publisher, streamCreatedListener, streamDestroyedListener ])

  return (
    <LiveParticipantItem 
      user={user}
      publisher={publisher}
      additionalControls={(
        <>
          <VODButton 
            size={32}
            fontSize={16}
            style={{ marginRight: 8 }}
          />
          <RecordButton 
            size={32}
            fontSize={16}
            style={{ marginRight: 8 }}
          />
          <ShareScreenButton 
            size={32}
            fontSize={16}
            style={{ marginRight: 8 }}
            onClick={handleShareScreenClick}
            isSharing={sharing}
          />
        </>
      )}
    />
  )
}
export default ModeratorParticipantItem