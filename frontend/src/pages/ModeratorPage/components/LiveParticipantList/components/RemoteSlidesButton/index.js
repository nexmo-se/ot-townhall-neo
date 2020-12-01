// @flow
import React from "react";
import User from "entities/user";

import useMessage from "hooks/message";
import useSession from "hooks/session";

import GiveAccessModal from "../GiveAccessModal";
import Icon from "components/Icon";
import ControlButton from "components/ControlButton";

interface IRemoteSlidesButton {
  user: User;
}

function RemoteSlidesButton({ user, ...props }: IRemoteSlidesButton) {
  const [open, setOpen] = React.useState<boolean>(false);
  const [active, setActive] = React.useState<boolean>(false);
  const { session } = useSession();
  const { revokeSlidesAccess } = useMessage();

  function toggleOpen() {
    if(!active) setOpen((prev) => !prev);
    else revokeSlidesAccess({ user });
  }

  const accessGranted = React.useCallback(({ data }) => {
    const remoteUser = User.fromJSON(JSON.parse(data));
    if(remoteUser.id === user.id) setActive(true); 
  }, [])

  const accessRevoked = React.useCallback(({ data }) => {
    const remoteUser = User.fromJSON(JSON.parse(data));
    if(remoteUser.id === user.id) setActive(false);
  }, [])

  React.useEffect(() => {
    if(session) session.on("signal:ack_slides-access", accessGranted);
    if(session) session.on("signal:ack_revoke-slides-access", accessRevoked);

    return function cleanup() {
      if(session) session.off("signal:ack_slides-access", accessGranted);
      if(session) session.off("signal:ack_revoke-slides-access", accessRevoked);
    }
  }, [session, accessGranted, accessRevoked]);

  return (
    <>
      <GiveAccessModal
        user={user}
        onClose={toggleOpen}
        open={open}
      />
      <ControlButton
        {...props}
        onClick={toggleOpen}
        active={active}
      >
        <Icon
          name="Vlt-icon-share-2-full"
          className="Vlt-icon--smaller"
        />
      </ControlButton>
    </>
  )
}
export default RemoteSlidesButton;