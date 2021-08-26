// @flow
import React from "react";
import { useMe } from "components/MeProvider";

import PresenterHangup from "./PresenterHangup";
import ParticipantHangup from "./ParticipantHangup";

function HangupButton ({ publisher, unpublish }) {
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