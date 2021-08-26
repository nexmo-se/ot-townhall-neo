import React from "react";
import User from "entities/user";
import CredentialAPI from "api/credential";
import clsx from "clsx";

import useStyles from "./styles";
import usePublisher from "hooks/publisher";
import useSession from "hooks/session";
import { useParams } from "react-router-dom";
import { useMe } from "components/MeProvider";

import ShareScreen from "../ShareScreen";
import PublisherFailedDialog from "components/PublisherFailedDialog";
import FullPageLoading from "components/FullPageLoading";
import WhiteLayer from "components/WhiteLayer"
import VideoHoverContainer from "components/VideoHoverContainer"
import VideoControl from "components/VideoControl";
import RightPanel from "components/RightPanel";
import VonageLogo from "components/VonageLogo"
import MainScreen from "components/MainScreen";

function Main () {
  const [publishFailed, setPublishFailed] = React.useState(false);
  const { me, loggedIn } = useMe();
  const { connected, session, connectWithCredential } = useSession();
  const { unpublish, publish: publishCamera, publisher: cameraPublisher } = usePublisher({ containerID: "cameraContainer" });
  const { tenant } = useParams();
  const mStyles = useStyles();

  const publishErrorListener = React.useCallback(
    (error) => {
      setPublishFailed(true);
    },
    []
  );

  React.useEffect(
    () => {
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
    },
    [loggedIn, me, connectWithCredential, tenant]
  );

  React.useEffect(
    () => {
      if(connected && session && me) {
        publishCamera({
          session,
          user: me,
          onError: publishErrorListener
        });
        setPublishFailed(false);
      }
    },
    [connected, session, me, publishCamera, publishErrorListener]
  );

  return (
    <>
      {!connected && <FullPageLoading />}
      <div className={mStyles.container}>
        <div className={clsx(mStyles.leftContainer, mStyles.black)}>
          <MainScreen />
          <WhiteLayer/>
          {
            (cameraPublisher)? (
              <VideoHoverContainer>
                <VideoControl 
                  publisher={cameraPublisher}
                  unpublish={unpublish}
                >
                  <ShareScreen />
                </VideoControl>
              </VideoHoverContainer>
            ): null
          }
          <div className={mStyles.logoContainer}>
            {/* <LiveBadge/> */}
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

      <PublisherFailedDialog
        visible={publishFailed}
        setVisible={setPublishFailed}
      />
    </>
  )
}
export default Main;