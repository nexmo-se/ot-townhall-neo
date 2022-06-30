import React from "react";

import { addResponseMessage } from "react-chat-widget";

import useMe from "hooks/me";
import { useEffect, useCallback, useState } from "react";
import { useParams } from "react-router-dom";

import { Widget } from "react-chat-widget";

function ChatWidget (props) {
  const {session} = props;
  const { me } = useMe();
  const { tenant } = useParams();

  const handleSignal = useCallback(
    (event) => {
      if (!session) return;

      // Do not process my own data
      if (event.from.connectionId === session.connection.connectionId) return;

      const acceptedSignal = ["signal:message"];
      if (!acceptedSignal.includes(event.type)) return;

      const data = JSON.parse(event.data);
      const textContent = `**${data.from}**\n\n${data.content}`;
      addResponseMessage(textContent);
    },
    [session]
  );

  function handleNewUserMessage (newMessage) {
    if (!session) return;
    if (!me) return;

    const body = {
      from: me.name,
      content: newMessage
    }

    session.signal({
      type: "message",
      data: JSON.stringify(body)
    }, (err) => {
      if (err) {
        console.log("signal error ("
                     + err.name
                     + "): " + err.message);
      } else {
        console.log("signal sent.");
      }
    });
  }

  useEffect(() => {
    if (session) session.on("signal", handleSignal);
    if (session) session.on("sessionDisconnect", () => console.log('disconnect'));

    return function cleanup() {
      if (session) session.off("signal", handleSignal);
    }
  }, [session, handleSignal])

  return (
    <Widget
      handleNewUserMessage={handleNewUserMessage}
      title="Waiting Room Chats"
      subtitle={`Room name: ${tenant}`}
    />
  )
}

export default ChatWidget;
