import React from "react";

import CredentialService from "api/credential";
import OT from "@opentok/client";
import { addResponseMessage } from "react-chat-widget";

import useMe from "hooks/me";
import { useEffect, useCallback, useState } from "react";
import { useParams } from "react-router-dom";

import { Widget } from "react-chat-widget";

function ChatWidget () {
  const [session, setSession] = useState();
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

    console.log("session", session);
    console.log("data", body)
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

  /**
   * Connect to lobby session, so everyone can have a chat
   */
  const connect = useCallback(
    async () => {
      // Get the credential
      const lobbyName = `${tenant}::lobby`
      const credential = await CredentialService.generateCredential({ tenant: lobbyName });

      const session = OT.initSession(credential.apiKey, credential.sessionId);
      session.connect(credential.token);
      setSession(session);
    },
    [tenant]
  )

  useEffect(() => {
    if (session) session.on("signal", handleSignal);
    return function cleanup() {
      if (session) session.off("signal", handleSignal);
    }
  }, [session, handleSignal])


  useEffect(
    () => {
      connect();
    },[connect]
  )


  return (
    <Widget
      handleNewUserMessage={handleNewUserMessage}
      title="Waiting Room Chats"
      subtitle={`Room name: ${tenant}`}
    />
  )
}

export default ChatWidget;
