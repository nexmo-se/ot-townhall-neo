// @flow
import React from "react";
import useMe from "hooks/me";
import { Publisher } from "@opentok/client";

import PresenterHangup from "./PresenterHangup";
import ParticipantHangup from "./ParticipantHangup";

interface HangupButtonProps {
  publisher: Publisher;
  unpublish: any;
}

function HangupButton ({ publisher, unpublish }: HangupButtonProps) {
  const { me } = useMe();

  if (!me) return null
  if (me.role === "presenter") {
    return <PresenterHangup />
  } else if (me.role === "participant") {
    return (
      <ParticipantHangup
        publisher={publisher}
        unpublish={unpublish}
      />
    )
  } else return null;
}

HangupButton.defaultProps = { size: 50, fontSize: 24 }
export default HangupButton;