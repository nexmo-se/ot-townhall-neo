// @flow
import React from "react";

import Message from "entities/message";
import User from "entities/user";

import useSession from "hooks/session";
import useMessage from "hooks/message";
import useDisplay from "hooks/display";
import { useParams } from "react-router-dom";

interface URLParameters {
  tenant: string;
}

interface RaiseHandButtonProps {
  cameraPublisher: any;
}

function RaiseHandButton ({ cameraPublisher }: RaiseHandButtonProps) {
  const { session } = useSession();
  const { raiseHand, send } = useMessage();
  const { tenant } = useParams<URLParameters>();
  const { display } = useDisplay({ tenant });

  function handleClick () {
    const user = User.fromConnection(session.connection);
    raiseHand({ user });
    
    const message = new Message(user, `${user.name} is raising hand`);
    send({ message });
  }

  if (cameraPublisher || !display.raiseHand) {
    return null;
  } else {
    return (
      <button 
        className="Vlt-btn Vlt-bg-aqua Vlt-white" 
        onClick={handleClick}
      >
        Raise Hand
      </button>
    )
  }
}

export default RaiseHandButton;