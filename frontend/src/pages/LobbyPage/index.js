// Assumption here is that you are logged in as role.
// However for Moderator and Presenter, you cannot go in this Lobby
import 'react-chat-widget/lib/styles.css';

import Logo from "@vonagevolta/volta2/images/logos/Vonage-lettermark.svg"
import styles from "./LobbyPage.module.css";

import ConfigurationService from "services/configuration";

import useInterval from 'use-interval';
import { useEffect, useState, useCallback } from 'react';
import { useMe } from "components/MeProvider";
import { useHistory, useParams } from 'react-router';

import VideoMarketing from "./components/VideoMarketing";
import ChatWidget from "./components/ChatWidget";
import ClosedRoom from './components/ClosedRoom';
import OpenedRoom from "./components/OpenedRoom";
import FullPageLoading from 'components/FullPageLoading';

function LobbyPage () {
  const [isChecking, setIsChecking] = useState(true);
  const [roomIsOpen, setRoomIsOpen] = useState(false);
  const { loggedIn } = useMe();
  const { tenant } = useParams();
  const { push } = useHistory();

  /**
   * This function will check the current room configuration
   * if the room is open, it will not navigate to the lobby
   */
   const checkRoom = useCallback(
    async () => {
      const configuration = await ConfigurationService.retrieve({ tenant });
      setRoomIsOpen(configuration.status === "open");
    },
    [tenant, push]
  )

  useEffect(
    () => {
      if (!loggedIn) push(`/${tenant}/participant/login`)
      else setIsChecking(false);
    },
    [loggedIn, push, tenant]
  )

  useInterval(
    () => {
      if (isChecking) return;
      if (roomIsOpen) return;
      checkRoom();
    },
    5000
  )

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
            <VideoMarketing />
          </div>
        </section>
        <ChatWidget />
      </main>
    );
  }
}

export default LobbyPage;
