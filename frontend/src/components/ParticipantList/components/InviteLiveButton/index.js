// @flow
import React from "react";
import User from "entities/user";

import useMe from "hooks/me";
import useSession from "hooks/session";
import useMessage from "hooks/message";

interface IInviteLiveButton { user: User }
function InviteLiveButton({ user }: IInviteLiveButton){
  const [ disabled, setDisabled ] = React.useState<boolean>(false);
  const [ publishing, setPublishing ] = React.useState<boolean>(false);
  const { me } = useMe();
  const { session, streams } = useSession();
  const mMessage = useMessage();

  async function handleInviteClick(){
    setDisabled(true);
    mMessage.forcePublish({ user });
    setDisabled(true);
  }

  const publishFailedListener = React.useCallback(({ from }) => {
    if(from.id === user.id) setDisabled(false);
  }, [ user.id ]);

  React.useEffect(() => {
    const stream = streams.find((stream) => {
      return stream.connection.id === user.id;
    });
    if(stream) {
      setPublishing(true);
      setDisabled(false);
    }else setPublishing(false);
  }, [ streams, user.id ])
  
  React.useEffect(() => {
    if(session) session.on("signal:force-publish-failed", publishFailedListener);
    return function cleanup(){
      if(session) session.off("signal:force-publish-failed", publishFailedListener);
    }
  }, [ session, publishFailedListener ])
  
  // Do not show invite live button when you are not moderators
  // Only moderator can invite live
  if(me?.role !== "moderator" || publishing) return null;
  else if(user.role === "moderator" || user.role === "presenter") return null;
  else return (
    <button
      className="Vlt-btn"
      disabled={disabled}
      style={{ margin: 0 }}
      onClick={handleInviteClick}
    >
      Invite Live
    </button>
  )
}
export default InviteLiveButton;