// @flow
import React from "react";
import CredentialAPI from "api/credential";
import User from "entities/user";
import clsx from "clsx";
import { v4 as uuid } from "uuid";

import useStyles from "./styles";
import useMe from "hooks/me";
import usePublisher from "hooks/publisher";
import useSession from "hooks/session";
import useMessage from "hooks/message";
import { useParams } from "react-router-dom";

import RaiseHandButton from "../RaiseHandButton";
import WhiteLayer from "components/WhiteLayer";
import RightPanel from "components/RightPanel";
import FullPageLoading from "components/FullPageLoading";
import VideoControl from "components/VideoControl";
import VideoHoverContainer from "components/VideoHoverContainer";
// import LiveBadge from "components/LiveBadge";
import VonageLogo from "components/VonageLogo";
import MainScreen from "components/MainScreen";

interface IParam { tenant: string }
function Main(){
  // eslint-disable-next-line
  const [ refreshToken, setRefreshToken ] = React.useState<string>(uuid());
  
  const { me, loggedIn } = useMe();
  const { connected, session, connectWithCredential } = useSession();
  const { unpublish, publish: publishCamera, publisher: cameraPublisher } = usePublisher({ containerID: "cameraContainer" });
  const { intendedForMe, forcePublishFailed } = useMessage();
  const { tenant } = useParams<IParam>();
  const mStyles = useStyles();

  const publishErrorListener = React.useCallback(
    (error: any) => {
      forcePublishFailed();
      alert("We tried to access your camera 3 times but failed. Please make sure you allow us to access your camera and no other application is using it. You may refresh the page to retry. \n\nWe will inform Moderator that your camera is not available.");
    },
    [forcePublishFailed]
  )

  const forcePublishListener = React.useCallback(
    ({ data }) => {
      if (intendedForMe({ data })) {
        const user = User.fromJSON(JSON.parse(data));
        publishCamera({
          session,
          user,
          onError: publishErrorListener
        });
      }
    },
    [
      publishCamera,
      intendedForMe,
      session,
      publishErrorListener
    ]
  );

  const forceUnpublishListener = React.useCallback(
    async ({ data }) => {
      if (intendedForMe({ data })) {
        await unpublish({ session });
        setRefreshToken(uuid());
      }
    },
    [
      session,
      unpublish,
      intendedForMe
    ]
  )

  React.useEffect(
    () => {
      async function connect () {
        if (loggedIn && me) {
          const credential = await CredentialAPI.generateCredential({
            role: "publisher",
            data: me.toJSON(),
            tenant
          });
          await connectWithCredential(credential);
        }
      }
      connect();
    },
    [
      loggedIn,
      me,
      connectWithCredential,
      tenant
    ]
  );

  React.useEffect(
    () => {
      if (session) session.on("signal:force-publish", forcePublishListener);
      if (session) session.on("signal:force-unpublish", forceUnpublishListener);
      return function cleanup(){
        if (session) session.off("signal:force-publish", forcePublishListener);
        if (session) session.off("signal:force-unpublish", forceUnpublishListener);
      }
    },
    [
      session,
      forcePublishListener,
      forceUnpublishListener
    ]
  )

  return (
    <>
      {!connected && <FullPageLoading />}
      <div className={mStyles.container}>
        <div className={clsx(mStyles.leftContainer, mStyles.black)}>
          <MainScreen />       
          <WhiteLayer />
          {cameraPublisher? (
            <VideoHoverContainer>
              <VideoControl 
                publisher={cameraPublisher} 
                unpublish={unpublish}
              />
            </VideoHoverContainer>
          ): null}
          <div className={mStyles.logoContainer}>
            {/* <LiveBadge/> */}
            <RaiseHandButton cameraPublisher={cameraPublisher} />
          </div>
          <VonageLogo style={{ position: "absolute", bottom: 32, right: 32, zIndex: 2 }}/>
        </div>
        <RightPanel user={me ?? new User({ name: "System", role: "system" })} />
      </div>
    </>
  )
}
export default Main;