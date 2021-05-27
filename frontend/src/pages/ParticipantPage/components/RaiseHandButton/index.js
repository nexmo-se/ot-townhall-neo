// @flow
import React from "react";
import lodash from "lodash";
import { Subscriber } from "@opentok/client";

import Message from "entities/message";
import User from "entities/user";

import useSession from "hooks/session";
import useMessage from "hooks/message";
import useDisplay from "hooks/display";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

interface URLParameters {
  tenant: string;
}

interface RaiseHandButtonProps {
  cameraPublisher: any;
}

function RaiseHandButton ({ cameraPublisher }: RaiseHandButtonProps) {
  const [canRaiseHand, setCanRaiseHand] = useState<boolean>(false);
  const [requesting, setRequesting] = useState<boolean>(false);
  const { session, subscribers } = useSession();
  const { raiseHand, send } = useMessage();
  const { tenant } = useParams<URLParameters>();
  const { display } = useDisplay({ tenant }); 

  function handleClick () {
    const user = User.fromConnection(session.connection);
    raiseHand({ user });
    setRequesting(true);
    
    const message = new Message(user, `${user.name} is raising hand`);
    send({ message });
  }

  useEffect(
    () => {
      // The button will not be displayed when no moderator
      // This is mainly because we use signalling. When no moderator
      // existis in the subscribers list, it might mean no moderator
      // in the session. Thus, raising hand is not possible
      const findModerator = (subscriber: Subscriber) => {
        const connection = lodash(subscriber).get("stream.connection");
        const user = User.fromConnection(connection);
        if (user.role === "moderator") return true;
        else return false;
      };

      const foundSubscriber = lodash(subscribers).find(findModerator);
      if (foundSubscriber) setCanRaiseHand(true);
      else setCanRaiseHand(false);
    },
    [subscribers]
  )

  if (cameraPublisher || !display.raiseHand || !canRaiseHand) {
    return null;
  } else {
    return (
      <button 
        className="Vlt-btn Vlt-btn--tertiary Vlt-btn--app" 
        onClick={handleClick}
        disabled={requesting}
      >
        {requesting? "Request Pending": "Raise Hand"}
      </button>
    )
  }
}

export default RaiseHandButton;