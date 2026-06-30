// @flow
import React from "react";
import User from "entities/user";
import useMessage from "hooks/message";
import { Publisher } from "@opentok/client";

import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ControlButton from "../index";

interface ParticipantHangupProps {
  publisher: Publisher;
  unpublish: any;
}

function ParticipantHangup ({ publisher, unpublish }: ParticipantHangupProps) {  
  const { forceUnpublish } = useMessage();

  async function handleClick () {
    const { connection } = publisher.stream;
    const user = User.fromConnection(connection);
    forceUnpublish({ user });
  }

  return (
    <ControlButton
      active={false}
      loading={false}
      onClick={handleClick}
      tooltip="Leave from Live"
    >
      <ExitToAppIcon fontSize="inherit" />
    </ControlButton>
  )
}

export default ParticipantHangup;
