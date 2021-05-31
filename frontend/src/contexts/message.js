// @flow
import React from "react";
import { createContext } from "react";

import useSession from "hooks/session";
import { useState, useEffect, useRef, useCallback } from "react";

import User from "entities/user";
import Message from "entities/message";

interface ISend { message: Message; }
interface IUserOnly { user: User; }
interface MessageProviderProps { children: any }
interface IForceVideo {
  user: User;
  hasVideo: boolean;
}

interface ISlidesAccess {
  target: User;
  pin: string;
}

interface IAck {
  type: string;
  data: any;
}

interface ISignalData {
  type: string;
  data?: string;
}

interface IForceAudio {
  user: User;
  hasAudio: boolean;
}

interface MessageContextProps {
  raisedHands: Array<User>;
  messages: Array<Message>;
  modalContainer: any;
  send: (args: ISend) => Promise<void>;
  slidesAccess: (args: ISlidesAccess) => Promise<void>;
  revokeSlidesAccess: (args: IUserOnly) => Promise<void>;
  raiseHand: (args: IUserOnly) => Promise<void>;
  removeRaisedHand: (user: User) => void;
  forcePublish: (args: IUserOnly) => Promise<void>;
  forceUnpublish: (args: IUserOnly) => Promise<void>;
  forceVideo: (args: IForceVideo) => Promise<void>;
  forceAudio: (args: IForceAudio) => Promise<void>;
  startPolling: () => Promise<void>;
  stopPolling: () => Promise<void>;
  ack: (args: IAck) => Promise<void>;
  publishFailed: () => Promise<void>;
  approveGoLive: (args: IUserOnly) => Promise<void>;
  declineGoLive: (args: IUserOnly) => Promise<void>;
  rejectGoLive: (args: IUserOnly) => Promise<void>;
  requestGoLive: (args: IUserOnly) => Promise<void>;
  intendedForMe: ({ data: any }) => boolean;
}

export const MessageContext = createContext<MessageContextProps>({
  raisedHands: [],
  messages: [],
  modalContainer: null,
  removeRaisedHand: (user: User) => {},
  slidesAccess: (args: ISlidesAccess) => Promise.resolve(),
  revokeSlidesAccess: (args: IUserOnly) => Promise.resolve(),
  raiseHand: (args: IUserOnly) => Promise.resolve(),
  forcePublish: (args: IUserOnly) => Promise.resolve(),
  forceUnpublish: (args: IUserOnly) => Promise.resolve(),
  forceVideo: (args: IForceVideo) => Promise.resolve(),
  forceAudio: (args: IForceAudio) => Promise.resolve(),
  stopPolling: () => Promise.resolve(),
  startPolling: () => Promise.resolve(),
  send: (args: ISend) => Promise.resolve(),
  ack: (args: IAck) => Promise.resolve(),
  publishFailed: () => Promise.resolve(),
  intendedForMe: ({ data: any }) => false,
  approveGoLive: (args: IUserOnly) => Promise.resolve(),
  declineGoLive: (args: IUserOnly) => Promise.resolve(),
  rejectGoLive: (args: IUserOnly) => Promise.resolve(),
  requestGoLive: (args: IUserOnly) => Promise.resolve()
});

export default function MessageProvider ({ children }: MessageProviderProps) {
  const [raisedHands, setRaisedHands] = useState<Array<User>>([]);
  const [messages, setMessages] = useState<Array<Message>>([]);
  const { session } = useSession();
  const modalContainer = useRef(null);

  function removeRaisedHand (user: User) {
    setRaisedHands(
      (prevRaisedHands) => prevRaisedHands.filter(
        (prevRaisedHand) => {
          return prevRaisedHand.id !== user.id
        }
      )
    )
  }

  async function signal ({ type, data }: ISignalData) {
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

  async function send ({ message }: ISend): Promise<void> {
    await signal({ type: "message", data: JSON.stringify(message.toJSON()) });
  }

  async function ack ({ type, data }: IAck): Promise<void> {
    await signal({
      type: `ack_${type}`,
      data: JSON.stringify(data)
    });
  }

  async function slidesAccess ({ target, pin }: ISlidesAccess) {
    await signal({
      type: "slides-access",
      data: JSON.stringify({ target, pin })
    });
  }

  async function revokeSlidesAccess ({ user }: IUserOnly) {
    await signal({ type: "revoke-slides-access", data: JSON.stringify(user.toJSON()) });
  }

  async function publishFailed () {
    await signal({ type: "publish-failed" });
  }

  // TODO: remove this because Moderator should not able to force publish
  async function forcePublish ({ user }: IUserOnly) {
    await signal({ type: "force-publish", data: JSON.stringify(user.toJSON()) });
  }
  
  async function approveGoLive ({ user }: IUserOnly) {
    const payload = user.toJSON();
    await signal({
      type: "raisehand.approved",
      data: JSON.stringify(payload)
    });
  }

  async function declineGoLive ({ user }: IUserOnly) {
    const payload = user.toJSON();
    await signal({
      type: "raisehand.declined",
      data: JSON.stringify(payload)
    })
  }

  async function rejectGoLive ({ user }: IUserOnly) {
    const payload = user.toJSON();
    await signal({
      type: "raishand.rejected",
      data: JSON.stringify(payload)
    });
  }

  /**
   * This function should be called by Moderator only to request participant to go live
   * the participant should listen for it, and display PrecallDialog
   */
  async function requestGoLive ({ user }: IUserOnly) {
    const payload = user.toJSON();
    await signal({
      type: "raisehand.request",
      data: JSON.stringify(payload)
    })
  }

  async function forceUnpublish ({ user }: IUserOnly) {
    await signal({ type: "force-unpublish", data: JSON.stringify(user.toJSON()) });
  }

  async function forceVideo ({ user, hasVideo }: IForceVideo) {
    const payload = Object.assign({}, user.toJSON(), { hasVideo });
    await signal({ type: "force-video", data: JSON.stringify(payload) });
  }

  async function forceAudio ({ user, hasAudio }: IForceAudio) {
    const payload = Object.assign({}, user.toJSON(), { hasAudio });
    await signal({ type: "force-audio", data: JSON.stringify(payload) });
  }

  async function raiseHand ({ user }: IUserOnly) {
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
    ({ data }): boolean => {
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