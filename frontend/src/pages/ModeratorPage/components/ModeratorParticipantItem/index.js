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
import ControlButton from "components/ControlButton";

interface ModeratorParticipantItemProps {
  user: User,
  publisher: Publisher
}

function ModeratorParticipantItem ({ user, publisher }: ModeratorParticipantItemProps) {
  const [sharing, setSharing] = React.useState<boolean>(false);
  const { publisher: screenPublisher, publish, unpublish } = usePublisher({ containerID: "cameraContainer" });
  const { session } = useSession();

  async function handleShareScreenClick () {
    if (session && !sharing) {
      const screenUser = new User({ name: "sharescreen", role: "sharescreen" });
      await publish({ 
        session: session, 
        user: screenUser,
        extraData: { videoSource: "screen" }
      });
      setSharing(true);
    } else if (session && sharing) {
      await unpublish({ session: session });
      setSharing(false);
    }
  }

  const streamCreatedListener = React.useCallback(
    () => setSharing(true),
    []
  );

  const streamDestroyedListener = React.useCallback(
    async () => {
      await unpublish({ session: session });
      setSharing(false)
    },
    [session, unpublish]
  );

  React.useEffect(
    () => {
      if (screenPublisher) screenPublisher.on("streamCreated", streamCreatedListener);
      if (screenPublisher) screenPublisher.on("streamDestroyed", streamDestroyedListener);

      return function cleanup () {
        if (screenPublisher) screenPublisher.off("streamCreated", streamCreatedListener);
        if (screenPublisher) screenPublisher.off("streamDestroyed", streamDestroyedListener);
      }
    },
    [screenPublisher, streamCreatedListener, streamDestroyedListener]
  )

  return (
    <LiveParticipantItem 
      user={user}
      publisher={publisher}
      withAvatar={false}
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
          <ControlButton.CycleCamera
            publisher={publisher}
            size={32}
            fontSize={16}
            style={{ marginRight: 8, marginBottom: 8 }}
          />
        </>
      )}
    />
  )
}
export default ModeratorParticipantItem