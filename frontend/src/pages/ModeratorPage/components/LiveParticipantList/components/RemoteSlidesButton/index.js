// @flow
import React from "react";
import User from "entities/user";

import GiveAccessModal from "../GiveAccessModal";
import Icon from "components/Icon";
import ControlButton from "components/ControlButton";

interface IRemoteSlidesButton {
  user: User;
}

function RemoteSlidesButton({ user, ...props }: IRemoteSlidesButton) {
  const [ open, setOpen ] = React.useState<boolean>(false);
  return (
    <>
      <GiveAccessModal
        user={user}
        onClose={() => {}}
        open
      />
      <ControlButton
        {...props}
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