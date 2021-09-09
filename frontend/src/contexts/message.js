import React from "react";
import { createContext } from "react";

import useSession from "hooks/session";
import { useState, useEffect, useRef, useCallback } from "react";

import User from "entities/user";
import Message from "entities/message";

export const MessageContext = createContext({
  raisedHands: [],
  messages: [],
  modalContainer: null,
  removeRaisedHand: (user) => {},
  slidesAccess: (args) => Promise.resolve(),
  revokeSlidesAccess: (args) => Promise.resolve(),
  raiseHand: (args) => Promise.resolve(),
  forcePublish: (args) => Promise.resolve(),
  forceUnpublish: (args) => Promise.resolve(),
  forceVideo: (args) => Promise.resolve(),
  forceAudio: (args) => Promise.resolve(),
  stopPolling: () => Promise.resolve(),
  startPolling: () => Promise.resolve(),
  send: (args) => Promise.resolve(),
  ack: (args) => Promise.resolve(),
  publishFailed: () => Promise.resolve(),
  intendedForMe: ({ data: any }) => false,
  approveGoLive: (args) => Promise.resolve(),
  declineGoLive: (args) => Promise.resolve(),
  rejectGoLive: (args) => Promise.resolve(),
  requestGoLive: (args) => Promise.resolve()
});

export default function MessageProvider ({ children }) {
  const [raisedHands, setRaisedHands] = useState([]);
  const [messages, setMessages] = useState([]);
  const { session } = useSession();
  const modalContainer = useRef(null);

  function removeRaisedHand (user) {
    setRaisedHands(
      (prevRaisedHands) => prevRaisedHands.filter(
        (prevRaisedHand) => {
          return prevRaisedHand.id !== user.id
        }
      )
    )
  }

  async function signal ({ type, data }) {
    return new Promise(
      (resolve, reject) => {
        const payload = JSON.parse(JSON.stringify({ type, data }));
      
        session.signal(
          payload,
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        )
      }
    )
  }

  async function send ({ message }) {
    await signal({ type: "message", data: JSON.stringify(message.toJSON()) });
  }

  async function ack ({ type, data }) {
    await signal({
      type: `ack_${type}`,
      data: JSON.stringify(data)
    });
  }

  async function slidesAccess ({ target, pin }) {
    await signal({
      type: "slides-access",
      data: JSON.stringify({ target, pin })
    });
  }

  async function revokeSlidesAccess ({ user }) {
    await signal({ type: "revoke-slides-access", data: JSON.stringify(user.toJSON()) });
  }

  async function publishFailed () {
    await signal({ type: "publish-failed" });
  }

  // TODO: remove this because Moderator should not able to force publish
  async function forcePublish ({ user }) {
    await signal({ type: "force-publish", data: JSON.stringify(user.toJSON()) });
  }
  
  async function approveGoLive ({ user }) {
    const payload = user.toJSON();
    await signal({
      type: "raisehand.approved",
      data: JSON.stringify(payload)
    });
  }

  async function declineGoLive ({ user }) {
    const payload = user.toJSON();
    await signal({
      type: "raisehand.declined",
      data: JSON.stringify(payload)
    })
  }

  async function rejectGoLive ({ user }) {
    const payload = user.toJSON();
    await signal({
      type: "raisehand.rejected",
      data: JSON.stringify(payload)
    });
  }

  /**
   * This function should be called by Moderator only to request participant to go live
   * the participant should listen for it, and display PrecallDialog
   */
  async function requestGoLive ({ user }) {
    const payload = user.toJSON();
    await signal({
      type: "raisehand.request",
      data: JSON.stringify(payload)
    })
  }

  async function forceUnpublish ({ user }) {
    await signal({ type: "force-unpublish", data: JSON.stringify(user.toJSON()) });
  }

  async function forceVideo ({ user, hasVideo }) {
    const payload = Object.assign({}, user.toJSON(), { hasVideo });
    await signal({ type: "force-video", data: JSON.stringify(payload) });
  }

  async function forceAudio ({ user, hasAudio }) {
    const payload = Object.assign({}, user.toJSON(), { hasAudio });
    await signal({ type: "force-audio", data: JSON.stringify(payload) });
  }

  async function raiseHand ({ user }) {
    await signal({
      type: "raisehand",
      data: JSON.stringify(user.toJSON())
    });
  }

  async function startPolling () {
    await signal({ type: "start-polling" });
  }

  async function stopPolling () {
    await signal({ type: "stop-polling" });
  }

  const intendedForMe = useCallback(
    ({ data }) => {
    const user = User.fromJSON(JSON.parse(data));
      const { connection: localConnection } = session;
      if(localConnection.id === user.id) return true;
      else return false;
    },
    [session]
  )

  const messageListener = useCallback(
    ({ data }) => {
      setMessages((prevMessage) => {
        const jsonData = JSON.parse(data);
        const message = Message.fromJSON(jsonData);
        return [ ...prevMessage, message ];
      })
    },
    []
  );

  const raiseHandListener = useCallback(
    ({ data }) => {
      setRaisedHands((prev) => {
        const jsonData = JSON.parse(data);
        const user = User.fromJSON(jsonData);
        const isNewUser = prev.filter((raisedHand) => raisedHand.id === user.id).length === 0;
        if(isNewUser) return [ ...prev, user ];
        else return prev;
      })
    },
    []
  )

  useEffect(
    () => {
      if (session) session.on("signal:message", messageListener)
      return function cleanup(){
        if (session) session.off("signal:message", messageListener)
      }
    },
    [session, messageListener]
  );

  useEffect(
    () => {
      if (session) session.on("signal:raisehand", raiseHandListener);

      return function cleanup(){
        if (session) session.off("signal:raisehand", raiseHandListener);
      }
    },
    [session, raiseHandListener]
  )

  return (
    <MessageContext.Provider
      value={{ 
        modalContainer,
        forceVideo,
        forceAudio,
        startPolling, 
        stopPolling,
        send,
        intendedForMe,
        raiseHand,
        raisedHands,
        removeRaisedHand,
        forcePublish,
        forceUnpublish,
        messages,
        slidesAccess,
        revokeSlidesAccess,
        ack,
        publishFailed,
        approveGoLive,
        declineGoLive,
        rejectGoLive,
        requestGoLive
      }}
    >
      <div ref={modalContainer} />
      {children}
    </MessageContext.Provider>
  )
}