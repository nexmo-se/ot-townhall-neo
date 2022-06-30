import React from 'react';
// However for Moderator and Presenter, you cannot go in this Lobby
import 'react-chat-widget/lib/styles.css';

import Logo from "@vonagevolta/volta2/images/logos/Vonage-lettermark.svg"
import styles from "./LobbyPage.module.css";

import ConfigurationService from "services/configuration";

import { useEffect, useState, useCallback } from 'react';
import useMe from "hooks/me";
import { useHistory, useParams } from 'react-router';

import VideoMarketing from "./components/VideoMarketing";
import ChatWidget from "./components/ChatWidget";
import ClosedRoom from './components/ClosedRoom';
import OpenedRoom from "./components/OpenedRoom";
import FullPageLoading from 'components/FullPageLoading';
import config from 'config';

function LobbyPage () {
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
      console.log("link", configuration.lobbySource.link)
      if (!lobbySource) {
        setLobbySource(configuration.lobbySource.link);
      }
    },
    [tenant, isChecking, roomIsOpen]
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
    console.log("start interval", intervalID)

    return function cleanup(){
      console.log("clean up", intervalID)
      clearInterval(intervalID);
    }
  }, [checkRoom])

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
              roomIsOpen? <OpenedRoom />: <ClosedRoom />
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
        <ChatWidget />
      </main>
    );
  }
}

export default LobbyPage;