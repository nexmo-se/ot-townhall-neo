import CredentialService from "services/credential";

import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useMe } from "components/MeProvider";

import MenuNavigation from "./components/MenuNavigation";
import MenuPanel from "./components/MenuPanel";
import Stage from "./components/Stage";
import Main from "./components/Main";
import FullPageLoading from "components/FullPageLoading";
import { OTSession } from "components/OT";

import MenuProvider from "./components/MenuProvider";
import ConfigurationProvider from "components/ConfigurationProvider";
import AudioVideoProvider from "components/AudioVideoProvider";

function ModeratorPage () {
  const [credential, setCredential] = useState(null);
  const { tenant } = useParams();
  const { push } = useHistory();
  const { loggedIn, me } = useMe();

  // Logged in status
  useEffect(
    () => {
      if (!loggedIn) push(`/${tenant}/moderator/login`);
    },
    [loggedIn, push, tenant]
  )

  // Once logged in
  // we need to generate credential as moderator so that it can connect
  // to the session.
  useEffect(
    () => {
      async function generateCredential () {
        if (!loggedIn) return undefined;
        if (!me) return undefined;

        const credential = await CredentialService.generateCredential({
          role: "moderator",
          data: me.toJSON(),
          tenant
        });
        setCredential(credential);
      }
      
      generateCredential();
    },
    [loggedIn, me, tenant]
  )

  if (!credential) {
    return <FullPageLoading />
  } else {
    return (
      <OTSession
        apiKey={credential.apiKey}
        sessionId={credential.sessionId}
        token={credential.token}
      >
        <ConfigurationProvider tenant={tenant}>
          <Main>
            <MenuProvider>
              <MenuNavigation />
              <MenuPanel />
            </MenuProvider>
            <AudioVideoProvider>
              <Stage />
            </AudioVideoProvider>
          </Main>
        </ConfigurationProvider>
      </OTSession>
    )
  }
}

export default ModeratorPage;
