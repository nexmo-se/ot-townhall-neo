// @flow
import React from "react";
import User from "entities/user";
import { Publisher } from "@opentok/client";

import usePublisher from "hooks/publisher";
import useSession from "hooks/session";

import LiveParticipantItem from "components/LiveParticipantItem";
import RecordButton from "components/RecordButton";
import ShareScreenButton from "components/ShareScreenButton";
import VODButton from "components/VODButton";

interface IModeratorParticipantItem {
  user: User,
  publisher: Publisher
}

function ModeratorParticipantItem({ user, publisher }: IModeratorParticipantItem){
  const mScreenPublisher = usePublisher("cameraContainer");
  const mSession = useSession();

  async function handleShareScreenClick(){
    if(mSession.session && !mScreenPublisher.stream){
      const screenUser = new User("sharescreen", "sharescreen");
      await mScreenPublisher.publish(screenUser, { videoSource: "screen" });
    }else if(mSession.session && mScreenPublisher.stream){
      mScreenPublisher.unpublish();
    }
  }

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
            isSharing={!!mScreenPublisher.stream}
          />
        </>
      )}
    />
  )
}
export default ModeratorParticipantItem