import React from 'react';
// However for Moderator and Presenter, you cannot go in this Lobby
import OT from "@opentok/client";
import CredentialService from "api/credential";

import 'react-chat-widget/lib/styles.css';
import Logo from "@vonagevolta/volta2/images/logos/Vonage-lettermark.svg"
import styles from "./LobbyPage.module.css";

import config from 'config';
import ConfigurationService from "services/configuration";

import useMe from "hooks/me";
import { useEffect, useState, useCallback } from 'react';
import { useHistory, useParams } from 'react-router';

import VideoMarketing from "./components/VideoMarketing";
import ChatWidget from "./components/ChatWidget";
import ClosedRoom from './components/ClosedRoom';
import OpenedRoom from "./components/OpenedRoom";
import FullPageLoading from 'components/FullPageLoading';

function LobbyPage () {
  const [session, setSession] = useState();
  const [isChecking, setIsChecking] = useState(true);
  const [roomIsOpen, setRoomIsOpen] = useState(false);
  const [lobbySource, setLobbySource] = useState();
  const { loggedIn } = useMe();
  const { tenant } = useParams();
  const { push } = useHistory();

  /**
   * This function will check the current room configuration
   * if the room is open, it will not navigate to the lobby
   */
   const checkRoom = useCallback(
    async () => {
      if (isChecking) return;
      const configuration = await ConfigurationService.retrieve({ tenant });
      setRoomIsOpen(configuration.state.status === "open");
      if (!lobbySource) {
        setLobbySource(configuration.lobbySource.link);
      }
    },
    [tenant, isChecking, roomIsOpen]
  )

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

  useEffect(
    () => {
      if (!loggedIn) push(`/${tenant}/participant/login`)
      else {setIsChecking(false); console.log("set checking false")};
    },
    [loggedIn, push, tenant]
  )

  useEffect(() => {
    checkRoom();
    const intervalID = setInterval(checkRoom, 5000);
    return function cleanup(){
      clearInterval(intervalID);
    }
  }, [checkRoom])

  useEffect(
    () => {
      connect();
    },[connect]
  )

  function enterRoom() {
    if (session) session.disconnect();
  }

  if (isChecking) {
    return <FullPageLoading />
  } else {
    return (
      <main className={styles.main}>
        <img
          className={styles.logo}
          alt=""
          src={Logo}
        />
        <section className={styles.mainContent}>
          <div className={styles.left}>
            {
              roomIsOpen? 
              <OpenedRoom 
                onEnter={enterRoom}
              />: <ClosedRoom />
            }
          </div>
          <div className={styles.right}>
            {
              lobbySource ?
                <VideoMarketing 
                lobbySource = {lobbySource}
              /> : ''
            }
   
          </div>
        </section>
        <ChatWidget 
          session={session}
        />
      </main>
    );
  }
}

export default LobbyPage;