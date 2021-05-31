// @flow
import React from "react";
import User from "entities/user";

import useMe from "hooks/me";
import useSession from "hooks/session";
import useMessage from "hooks/message";
import { useEffect, useState, useCallback } from "react";

interface InviteLiveButtonProps {
  user: User
}

function InviteLiveButton ({ user }: InviteLiveButtonProps) {
  const [disabled, setDisabled] = React.useState<boolean>(false);
  const [publishing, setPublishing] = useState<boolean>(false);
  const { me } = useMe();
  const { session, streams } = useSession();
  const { requestGoLive } = useMessage();

  async function handleInviteClick () {
    setDisabled(true);
    requestGoLive({ user });
    setDisabled(true);
  }

  const publishFailedListener = useCallback(
    ({ from }) => {
      if (from.id === user.id) setDisabled(false);
    },
    [user.id]
  );

  const rejectedRaiseHandListener = useCallback(
    ({ from }) => {
      if (from.id === user.id) setDisabled(false);
    },
    [user.id]
  )

  useEffect(
    () => {
      const stream = streams.find((stream) => {
        return stream.connection.id === user.id;
      });

      if (stream) {
        setPublishing(true);
        setDisabled(false);
      } else setPublishing(false);
    },
    [streams, user.id]
  )
  
  useEffect(
    () => {
      if (session) session.on("signal:publish-failed", publishFailedListener);
      if (session) session.on("signal:raisehand.rejected", rejectedRaiseHandListener);
      return function cleanup(){
        if (session) session.off("signal:publish-failed", publishFailedListener);
        if (session) session.off("signal:raisehand.rejected", rejectedRaiseHandListener);
      }
    },
    [session, publishFailedListener, rejectedRaiseHandListener]
  )
  
  // Do not show invite live button when you are not moderators
  // Only moderator can invite live
  if(me?.role !== "moderator" || publishing) return null;
  else if(user.role === "moderator" || user.role === "presenter") return null;
  else return (
    <button
      className="Vlt-btn Vlt-btn--app"
      disabled={disabled}
      style={{ margin: 0 }}
      onClick={handleInviteClick}
    >
      Request Go Live
    </button>
  )
}
export default InviteLiveButton;