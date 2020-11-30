// @flow
import React from "react";

import Icon from "components/Icon";
import ControlButton from "components/ControlButton";

interface IRemoteSlidesButton {

}

function RemoteSlidesButton({ ...props }: IRemoteSlidesButton) {
  return (
    <ControlButton
      {...props}
    >
      <Icon
        name="Vlt-icon-share-2-full"
        className="Vlt-icon--smaller"
      />
    </ControlButton>
  )
}
export default RemoteSlidesButton;