// @flow
import React from "react";
import User from "entities/user";

import useMessage from "hooks/message";
import useSession from "hooks/session";

import GiveAccessModal from "../GiveAccessModal";
import ControlButton from "components/ControlButton";
import ShareIcon from '@material-ui/icons/Share';

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
  }, [user.id])

  const accessRevoked = React.useCallback(({ data }) => {
    const remoteUser = User.fromJSON(JSON.parse(data));
    if(remoteUser.id === user.id) setActive(false);
  }, [user.id])

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
        fontSize={16}
      >
        <ShareIcon fontSize="inherit" />
      </ControlButton>
    </>
  )
}
export default RemoteSlidesButton;