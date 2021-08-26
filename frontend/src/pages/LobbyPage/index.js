// Assumption here is that you are logged in as role.
// However for Moderator and Presenter, you cannot go in this Lobby
import 'react-chat-widget/lib/styles.css';

import Logo from "@vonagevolta/volta2/images/logos/Vonage-lettermark.svg"
import styles from "./LobbyPage.module.css";

import { useEffect } from 'react';
import { useMe } from "components/MeProvider";
import { useHistory, useParams } from 'react-router';

import VideoMarketing from "./components/VideoMarketing";
import ChatWidget from "./components/ChatWidget";

function LobbyPage () {
  const { loggedIn } = useMe();
  const { tenant } = useParams();
  const { push } = useHistory();

  useEffect(
    () => {
      if (!loggedIn) push(`/${tenant}/participant/login`)
    },
    [loggedIn]
  )

  return (
    <main className={styles.main}>
      <img
        className={styles.logo}
        alt=""
        src={Logo}
      />
      <section className={styles.mainContent}>
        <div className={styles.left}>
          <h1>
            Welcome!
          </h1>
          <p>
            The Moderator haven't open the room yet.
          </p>
          <p>
            While waiting, you can have chat with other participants here.
          </p>
        </div>
        <div className={styles.right}>
          <VideoMarketing />
        </div>
      </section>
      <ChatWidget />
    </main>
  );
}

export default LobbyPage;
