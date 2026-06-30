// @flow
import React from "react";

import useSession from "hooks/session";
import useMe from "hooks/me";

interface RemoveParticipantButtonProps {
  user: User
}

function RemoveParticipantButton ({ user }: RemoveParticipantButtonProps) {
  const [disabled, setDisabled] = React.useState<boolean>(false);
  const { session } = useSession();
  const { me } = useMe();

  async function handleRemoveParticipantClick () {
    setDisabled(true);
    session.forceDisconnect(user.connection, (err) => {
      if (err) {
        alert("Force Disconnect Error: ", err)
        setDisabled(false);
      }
    })
  }
  
  if(me?.role !== "moderator") return null;
  else if(!user || user.role === "moderator" || user.role === "presenter") return null;
  else return (
    <button
      className="Vlt-btn Vlt-btn--app"
      disabled={disabled}
      style={{ margin: 0 }}
      onClick={handleRemoveParticipantClick}
    >
      Disconnect
    </button>
  )
}
export default RemoveParticipantButton;