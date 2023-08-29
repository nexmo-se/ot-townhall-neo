// @flow
import React from "react";
import CredentialAPI from "api/credential";
import AMAAPI from "api/ama";

import User from "entities/user";
import clsx from "clsx";
import { v4 as uuid } from "uuid";

import useStyles from "./styles";
import useMe from "hooks/me";
import usePublisher from "hooks/publisher";
import useSession from "hooks/session";
import useMessage from "hooks/message";
import { useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";

import RaiseHandButton from "../RaiseHandButton";
import PrecallDialog from "components/PrecallDialog";
import ReactionButton from "components/ReactionButton";
import InfoDialog from "components/InfoDialog";
import PublisherFailedDialog from "components/PublisherFailedDialog";
import RightPanel from "components/RightPanel";
import FullPageLoading from "components/FullPageLoading";
import VideoControl from "components/VideoControl";
import VideoHoverContainer from "components/VideoHoverContainer";
import MainScreen from "components/MainScreen";

interface IParam { tenant: string }
function Main () {
  // eslint-disable-next-line
  const [refreshToken, setRefreshToken] = useState<string>(uuid());
  const [precallOpen, setPrecallOpen] = useState<boolean>(false);
  const [infoOpen, setInfoOpen] = useState<boolean>(false);
  const [videoHoverVisible, setVideoHoverVisible] = useState<boolean>(false);
  const [publisherFailedOpen, setPublisherFailedOpen] = useState<boolean>(false);
  
  const { me, loggedIn, customerDetails } = useMe();
  const { connected, session, connectWithCredential } = useSession();
  const { unpublish, publish: publishCamera, publisher: cameraPublisher } = usePublisher({ containerID: "cameraContainer" });
  const { intendedForMe, publishFailed } = useMessage();
  const { tenant } = useParams<IParam>();
  const mStyles = useStyles();

  const publishErrorListener = useCallback(
    (error: any) => {
      publishFailed();
      setRefreshToken(uuid()); // Re-render because publisher has changed
      setPublisherFailedOpen(true);
    },
    [publishFailed]
  );

  function handleApproved (user: User) {
    setPrecallOpen(true);
  }

  function handleDeclined () {
    // The moderator has declined your Go Live request.
    setInfoOpen(true);
  }

  function handleApproveClick ({ publisher, hasAudio, hasVideo }) {
    if (!me) return;

    publishCamera({
      session,
      user: me,
      onError: publishErrorListener,
      extraData: {
        videoSource: publisher.getVideoSource(),
        publishAudio: hasAudio,
        publishVideo: hasVideo
      }
    });
  }

  const forceUnpublishListener = useCallback(
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

  const requestRaiseHandListener = useCallback(
    async ({ data }) => {
      if (intendedForMe({ data })) {
        setPrecallOpen(true);
      }
    },
    [intendedForMe]
  )

  useEffect(
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

  useEffect(() => {
    if (tenant && customerDetails) {
      AMAAPI.create({ tenant, participant: customerDetails });
    }
  }, [tenant, customerDetails])

  useEffect(
    () => {
      if (session) session.on("signal:force-unpublish", forceUnpublishListener);
      if (session) session.on("signal:raisehand.request", requestRaiseHandListener);
      return function cleanup () {
        if (session) session.off("signal:force-unpublish", forceUnpublishListener);
        if (session) session.off("signal:raisehand.request", requestRaiseHandListener);
      }
    },
    [session, forceUnpublishListener, requestRaiseHandListener]
  )

  return (
    <>
      {!connected && <FullPageLoading />}
      <div className={mStyles.container}>
        <div className={clsx(mStyles.leftContainer, mStyles.black)}>
          <MainScreen />
          {cameraPublisher? (
            <VideoHoverContainer
            videoHoverVisible={videoHoverVisible}
            setVideoHoverVisible={setVideoHoverVisible}
            >
              <VideoControl 
                publisher={cameraPublisher} 
                unpublish={unpublish}
              />
            </VideoHoverContainer>
          ): null}
          <div className={mStyles.logoContainer}>
            <RaiseHandButton
              cameraPublisher={cameraPublisher}
              onApproved={handleApproved}
              onDeclined={handleDeclined}
            />
          </div>
          <div id="emojiContainer"></div>
          <div>
            <ReactionButton
                room={session}
            ></ReactionButton>
          </div>

        </div>
        <RightPanel user={me ?? new User({ name: "System", role: "system" })} />
      </div>

      <PrecallDialog
        visible={precallOpen}
        setVisible={setPrecallOpen}
        onApprove={handleApproveClick}
      />
      <InfoDialog
        id="moderator-decline"
        title="Moderator has declined your request"
        visible={infoOpen}
        setVisible={setInfoOpen}
      >
        <p>The moderator has declined your request to Go Live. You can make the request again, or ask the moderator via Chat</p>
      </InfoDialog>
      <PublisherFailedDialog
        visible={publisherFailedOpen}
        setVisible={setPublisherFailedOpen}
      />
    </>
  )
}
export default Main;