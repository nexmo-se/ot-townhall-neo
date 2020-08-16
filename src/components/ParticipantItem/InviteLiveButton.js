// @flow
import React from "react";
import User from "entities/user";

import useMe from "hooks/me";
import useSession from "hooks/session";
import useMessage from "hooks/message";

type Props = { user: User }

function InviteLiveButton({ user }:Props){
  const [ inviteDisabled, setInviteDisabled ] = React.useState<boolean>();
  const [ isPublishing, setIsPublishing ] = React.useState<boolean>();
  const mMe = useMe();
  const mSession = useSession();
  const mMessage = useMessage();
  
  async function handleInviteClick(){
    setInviteDisabled(true);
    if(!user.id) throw new Error("User does not have ID. Is someone hack my application");
    if(mMe.me.role !== "moderator") throw new Error("User is not moderator. Someone hack my application");
    if(mSession.session){
      await new Promise((resolve, reject) => {
        mSession.session.signal({
          type: "force-publish",
          data: JSON.stringify(user.toJSON())
        }, (err) => {
          if(err) reject(err);
          else resolve();
        });
      });
    }
  }
  
  React.useEffect(() => {
    // If publishing, do not show invite live button
    const stream = mSession.streams.find((stream) => {
      const { connection: remoteConnection } = stream;
      return remoteConnection.id === user.id;
    })
    if(stream) {
      setIsPublishing(true);
      setInviteDisabled(false);
    }else setIsPublishing(false);
  }, [ mSession.streams, user ]);
  
  React.useEffect(() => {
    if(mMessage.forcePublishFailed){
      const { from:remoteUser } = mMessage.forcePublishFailed;
      if(remoteUser.id === user.id) setInviteDisabled(false);
    }
  }, [ mMessage.forcePublishFailed ]);
  
  // Do not show invite live button when you are not moderators
  // Only moderator can invite live
  if((mMe.me && mMe.me.role !== "moderator") || isPublishing) return null
  else if(user.role === "moderator") return null;
  else return (
    <button
      className="Vlt-btn"
      style={{ margin: 0 }}
      disabled={inviteDisabled}
      onClick={handleInviteClick}
    >
      Invite Live
    </button>
  )
}
export default InviteLiveButton;