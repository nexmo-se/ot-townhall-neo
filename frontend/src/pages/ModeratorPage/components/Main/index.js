// @flow
import React from "react";
import CredentialAPI from "api/credential";
import clsx from "clsx";

import useSession from "hooks/session";
import useStyles from "./styles";
import useMe from "hooks/me";
import usePublisher from "hooks/publisher";
import { useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";

import LiveParticipantList from "../LiveParticipantList";
import ModeratorParticipantItem from "../ModeratorParticipantItem";
import RaisedHandList from "../RaisedHandList";
import ModeratorMessageTab from "../ModeratorMessageTab";
import MainScreen from "../MainScreen";
import PublisherFailedDialog from "components/PublisherFailedDialog";
import InfoDialog from "components/InfoDialog";
import FullPageLoading from "components/FullPageLoading";
import ParticipantList from "components/ParticipantList";

interface URLParamters { tenant: string }

function Main () {
  const [publishFailed, setPublishFailed] = useState<boolean>(false);
  const [publishFailedOpen, setPublishFailedOpen] = useState<boolean>(false);
  const [rejectedOpen, setRejectedOpen] = useState<boolean>(false);
  const { me, loggedIn } = useMe();
  const { session, connected, connections, connectWithCredential } = useSession();
  const { publish: publishCamera, publisher: cameraPublisher } = usePublisher({ containerID: "cameraContainer" });
  const { tenant } = useParams<URLParamters>();
  const mStyles = useStyles();

  const publishErrorListener = useCallback(
    (error: any) => {
      setPublishFailed(true);
    },
    []
  );

  const remotePublishFailedListener = useCallback(
    () => {
      // Open a dialog mentioning that the remote publisher
      // has failed to publish the stream
      setPublishFailedOpen(true);
    },
    []
  )

  const rejectedRaiseHandListener = useCallback(
    () => {
      // When the participant reject the Go Live request,
      // show the dialog
      setRejectedOpen(true);
    },
    []
  )

  useEffect(
    () => {
      async function connect () {
        if (loggedIn && me) {
          const credential = await CredentialAPI.generateCredential({
            role: "moderator",
            data: me.toJSON(),
            tenant
          });
          await connectWithCredential(credential);
        }
      }
      connect();
    }, 
    [loggedIn, me, connectWithCredential, tenant]
  );

  useEffect(
      () => {
      if (connected && session && me) {
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

  useEffect(
    () => {
      if (session) session.on("signal:publish-failed", remotePublishFailedListener);
      if (session) session.on("signal:raisehand.rejected", rejectedRaiseHandListener);
      return function cleanup () {
        if (session) session.off("signal:publish-failed", remotePublishFailedListener);
        if (session) session.off("signal:raisehand.rejected", rejectedRaiseHandListener);
      }
    },
    [session, remotePublishFailedListener, rejectedRaiseHandListener]
  )

  return (
    <>
      {!connected && <FullPageLoading />}
      <div className={mStyles.container}>
        <div className={mStyles.leftSection}>
          <div className={mStyles.item} style={{ 
              borderBottom: "1px solid #e7ebee",
              flexBasis: "30%"
            }}
          >
            <h4 className="Vlt-center">RAISING HAND</h4>
            <RaisedHandList />
          </div>
          <div className={mStyles.item} style={{ 
              flexBasis: "70%",
              paddingLeft: 32, 
              paddingRight: 32, 
              paddingTop: 32 
            }}
          >
            <ModeratorMessageTab />
          </div>
        </div>
        <div className={mStyles.centerPanel}>
          <div className={mStyles.item} style={{ flexBasis: "50%", borderBottom: "1px solid #e7ebee" }}>
            <h4 className="Vlt-center">LIVE PARTICIPANTS</h4>
            <LiveParticipantList>
              {(me)? (
                <>
                  <ModeratorParticipantItem 
                    user={me}
                    publisher={cameraPublisher}
                  />
                </>
              ): null}
            </LiveParticipantList> 
          </div>
          <div
            className={mStyles.item}
            style={{ flexBasis: "50%", paddingTop: 32 }}
          >
            <h4 className="Vlt-center">
              PARTICIPANTS ({connections.length})
            </h4>
            <ParticipantList />
          </div>
        </div>
        <div
          className={
            clsx(
              mStyles.rightPanel,
              mStyles.black
            )
          }
        >
          <MainScreen />        
        </div>
      </div>

      <InfoDialog
        id="remote-publish-failed"
        title="Remote publish failed"
        visible={publishFailedOpen}
        setVisible={setPublishFailedOpen}
      >
        <p>Participant / presenter has failed to publish the stream. You can ask them to re-join the session</p>
      </InfoDialog>

      <PublisherFailedDialog
        visible={publishFailed}
        setVisible={setPublishFailed}
      />

      <InfoDialog
        id="raisehand-rejected"
        title="Go Live request has been rejected"
        visible={rejectedOpen}
        setVisible={setRejectedOpen}
      >
        <p>Participant / presenter has rejected the Go Live request. Please ask again if they want to be available live</p>
      </InfoDialog>
    </>
  )
}

export default Main;
