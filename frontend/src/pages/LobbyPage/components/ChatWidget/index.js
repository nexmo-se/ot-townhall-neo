import CredentialService from "api/credential";
import OT from "@opentok/client";
import { addResponseMessage } from "react-chat-widget";

import { useMe } from "components/MeProvider";
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

    session.signal({
      type: "message",
      data: JSON.stringify(body)
    }, (err) => console.log(err));
  }

  /**
   * Connect to lobby session, so everyone can have a chat
   */
  const connect = useCallback(
    async () => {
      // Get the credential
      const lobbyName = `${tenant}::lobby`
      const credential = await CredentialService.generateCredential({ tenant: lobbyName });

      // I don't care if we already have the session previously.
      // Just create a new one
      const session = OT.initSession(credential.apiKey, credential.sessionId);
      session.on("signal", handleSignal);
      session.connect(credential.token);
      setSession(session);
    },
    [tenant, handleSignal]
  )

  useEffect(
    () => connect(),
    [connect]
  )

  return (
    <Widget
      handleNewUserMessage={handleNewUserMessage}
    />
  )
}

export default ChatWidget;
