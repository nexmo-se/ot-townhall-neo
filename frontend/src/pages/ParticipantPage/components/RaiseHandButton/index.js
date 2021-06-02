// @flow
import React from "react";
import lodash from "lodash";
import { Subscriber } from "@opentok/client";

import Message from "entities/message";
import User from "entities/user";

import useSession from "hooks/session";
import useMessage from "hooks/message";
import useDisplay from "hooks/display";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";

interface URLParameters {
  tenant: string;
}

interface RaiseHandButtonProps {
  cameraPublisher: any;
  onApproved: (user: User) => void;
  onDeclined?: () => void;
}

function RaiseHandButton ({ cameraPublisher, onApproved, onDeclined }: RaiseHandButtonProps) {
  const [canRaiseHand, setCanRaiseHand] = useState<boolean>(false);
  const [requesting, setRequesting] = useState<boolean>(false);
  const { session, subscribers } = useSession();
  const { raiseHand, send, intendedForMe } = useMessage();
  const { tenant } = useParams<URLParameters>();
  const { display } = useDisplay({ tenant }); 

  function handleClick () {
    const user = User.fromConnection(session.connection);
    raiseHand({ user });
    setRequesting(true);
    
    const message = new Message(user, `${user.name} is raising hand`);
    send({ message });
  }

  const approvedListener = useCallback(
    ({ data }) => {
      if (!intendedForMe({ data })) return;
      setRequesting(false);

      if (!onApproved) return;
      const user = User.fromJSON(JSON.parse(data));
      onApproved(user);
    },
    [intendedForMe, onApproved]
  )

  const declinedListener = useCallback(
    ({ data }) => {
      if (!intendedForMe({ data})) return;
      
      setRequesting(false);
      if (onDeclined) onDeclined();
    },
    [intendedForMe, onDeclined]
  )

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

  useEffect(
    () => {
      if (session) session.on("signal:raisehand.approved", approvedListener);
      if (session) session.on("signal:raisehand.declined", declinedListener);

      return function cleanup () {

      }
    },
    [session, approvedListener, declinedListener]
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
        {requesting? "Request Pending": "Request to Go Live"}
      </button>
    )
  }
}

export default RaiseHandButton;