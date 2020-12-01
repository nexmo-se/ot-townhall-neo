// @flow
import React from "react";
import User from "entities/user";
import CredentialAPI from "api/credential";
import clsx from "clsx";

import useStyles from "./styles";
import useMe from "hooks/me";
import usePublisher from "hooks/publisher";
import useSession from "hooks/session";
import { useParams } from "react-router-dom";

import ShareScreen from "../ShareScreen";
import FullPageLoading from "components/FullPageLoading";
import WhiteLayer from "components/WhiteLayer"
import VideoHoverContainer from "components/VideoHoverContainer"
import VideoControl from "components/VideoControl";
import LiveBadge from "components/LiveBadge";
import RightPanel from "components/RightPanel";
import VonageLogo from "components/VonageLogo"
import MainScreen from "components/MainScreen";

interface IParam { tenant: string }
function Main(){
  const { me, loggedIn } = useMe();
  const { connected, session, connectWithCredential } = useSession();
  const { unpublish, publish: publishCamera, publisher: cameraPublisher } = usePublisher({ containerID: "cameraContainer" });
  const { tenant } = useParams<IParam>();
  const mStyles = useStyles();

  React.useEffect(() => {
    async function connect(){
      if(loggedIn && me){
        const credential = await CredentialAPI.generateCredential({
          role: "publisher",
          data: me.toJSON(),
          tenant
        })
        await connectWithCredential(credential);
      }
    }
    connect();
  }, [ loggedIn, me, connectWithCredential, tenant ]);

  React.useEffect(() => {
    if(connected && session && me) publishCamera({ session, user: me });
  }, [ connected, session, me, publishCamera ]);

  return (
    <>
      {!connected && <FullPageLoading />}
      <div className={mStyles.container}>
        <div className={clsx(mStyles.leftContainer, mStyles.black)}>
          {/* <LayoutContainer id="cameraContainer" size="big" /> */}
          <MainScreen />
          <WhiteLayer/>
          <VideoHoverContainer>
            <VideoControl 
              publisher={cameraPublisher}
              unpublish={unpublish}
            >
              <ShareScreen />
            </VideoControl>
          </VideoHoverContainer>
          <div className={mStyles.logoContainer}>
            <LiveBadge/>
          </div>
          <VonageLogo 
            style={{ 
              position: "absolute", 
              bottom: 32, 
              right: 32,
              zIndex: 2 
            }}
          />
        </div>
        <RightPanel user={me ?? new User({ name: "System", role: "system" })} />
      </div>
    </>
  )
}
export default Main;