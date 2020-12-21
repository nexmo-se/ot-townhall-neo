// @flow
import React from "react";
import CredentialAPI from "api/credential";

import useStyles from "./styles";
import useMe from "hooks/me";
import useSession from "hooks/session";
import { useParams } from "react-router-dom";

import LiveBadge from "components/LiveBadge";
import VonageLogo from "components/VonageLogo"
import BlackLayer from "components/BlackLayer";
import WhiteLayer from "components/WhiteLayer";
import Chat from "components/Chat";
import FullPageLoading from "components/FullPageLoading";
import MainScreen from "components/MainScreen";
import ModeratorStream from "components/ModeratorStream";

interface IParam { tenant: string }
function GhostRiderPage(){
  const mStyles = useStyles();
  const { me, loggedIn } = useMe();
  const { connected, connectWithCredential } = useSession();
  const { tenant } = useParams<IParam>();

  React.useEffect(() => {
    async function connect(){
      if(loggedIn && me){
        const credential = await CredentialAPI.generateCredential({
          role: "publisher",
          data: me.toJSON(),
          tenant
        });
        await connectWithCredential(credential);
      }
    }
    connect();
  }, [ loggedIn, me, connectWithCredential, tenant ]);

  return (
    <>
      {!connected && <FullPageLoading />}
      <div className={mStyles.container}>
        <div className={mStyles.leftContainer}>
          <MainScreen />
          <BlackLayer/>
          <WhiteLayer/>
          <div className={mStyles.logoContainer}>
            <LiveBadge/>
          </div>
          <VonageLogo style={{ position: "absolute", bottom: 32, right: 32, zIndex: 2 }}/>
        </div>
        <div className={mStyles.rightContainer}>
          <ModeratorStream />
          <div className={mStyles.chatContainer}>
            <Chat withInput={false} />
          </div>
        </div>
      </div>
    </>
  )
}
export default GhostRiderPage;