// @flow
import React from 'react';
import User from 'entities/user';
import { Publisher } from '@opentok/client';

import usePublisher from 'hooks/publisher';
import useSession from 'hooks/session';

import RecordButton from '../RecordButton';
import LiveParticipantItem from '../LiveParticipantItem';
import ShareScreenButton from 'components/ShareScreenButton';
import ControlButton from 'components/ControlButton';
import BackgroundBlurButton from 'components/BackgroundBlurButton';
import ExperienceRendererButton from '../ExperienceRendererButton';
import RoomControlButton from '../RoomControlButton';

import * as VideoEffects from '@vonage/video-effects';

const { BackgroundBlurEffect } = VideoEffects;

interface ModeratorParticipantItemProps {
  user: User;
  publisher: Publisher;
  unpublish: any;
  publish: any;
}

function ModeratorParticipantItem({
  user,
  publisher,
  unpublish,
  publish
}: ModeratorParticipantItemProps) {
  const [sharing, setSharing] = React.useState<boolean>(false);
  const [hasbackgroundBlur, setHasBackgroundBlur] =
    React.useState<boolean>(false);
  const [isBackgroundBlurLoading, setIsBackgroundBlurLoading] =
    React.useState<boolean>(false);

  const {
    publisher: screenPublisher,
    publish: screenPublish,
    unpublish: screenUnpublish
  } = usePublisher({ containerID: 'cameraContainer' });
  const { connected, session, streams } = useSession();

  const backgroundBlur = React.useRef(null);
  const localMediaTrack = React.useRef(null);
  const currentDeviceId = React.useRef(null);

  const domCameraContainer = document.getElementById('cameraContainer');

  // Screen Sharing
  async function handleShareScreenClick(videoContentHint = "") {
    if (session && !sharing) {
      const screenUser = new User({ name: '', role: 'sharescreen' });
      await screenPublish({
        session: session,
        user: screenUser,
        extraData: { videoSource: 'screen',  videoContentHint},
        attempt: 3 // Do not retry
      });
    } else if (session && sharing) {
      await screenUnpublish({ session: session });
    }
  }

  React.useEffect(() => {
    if (!streams || !screenPublisher) return
    const myShareStreamFound = streams.find((stream) => screenPublisher.stream && stream.id == screenPublisher.stream.id)
    if (!sharing && myShareStreamFound ) {
      setSharing(true)
    }
    else if (sharing && !myShareStreamFound) {
      setSharing(false)
    }
  }, [streams, screenPublisher])

  // Background Blur
  async function handleBackgroundBlurEffectClick() {
    if (!hasbackgroundBlur) {
      setIsBackgroundBlurLoading(true);
      await unpublish({ session });

      currentDeviceId.current = publisher.getVideoSource().deviceId;
      localMediaTrack.current = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: currentDeviceId.current }
      });

      backgroundBlur.current = new BackgroundBlurEffect({
        assetsPath: process.env.REACT_APP_ASSETS_PATH
      });
      await backgroundBlur.current.loadModel();

      const outputStream = backgroundBlur.current.startEffect(
        localMediaTrack.current
      );

      domCameraContainer.classList.add('background-blur');

      if (connected && session && user) {
        await publish({
          session,
          user,
          videoSource: outputStream.getVideoTracks()[0]
        });
      }

      setHasBackgroundBlur(true);
      setIsBackgroundBlurLoading(false);
    } else {
      setIsBackgroundBlurLoading(true);

      backgroundBlur.current.stopEffect();
      localMediaTrack.current.getTracks().forEach((t) => t.stop());

      await unpublish({ session: session });

      domCameraContainer.classList.remove('background-blur');

      if (connected && session && user) {
        await publish({
          session,
          user,
          videoSource: currentDeviceId.current
        });
      }

      setHasBackgroundBlur(false);
      setIsBackgroundBlurLoading(false);
    }
  }

  return (
    <LiveParticipantItem
      user={user}
      publisher={publisher}
      withAvatar={false}
      additionalControls={
        <>
          <RecordButton size={32} fontSize={16} style={{ marginRight: 8 }} />
          <ExperienceRendererButton
            size={32}
            fontSize={16}
            style={{ marginRight: 8 }}
          />
          <BackgroundBlurButton
            size={32}
            fontSize={16}
            style={{ marginRight: 8 }}
            onClick={handleBackgroundBlurEffectClick}
            hasBackgroundBlurEffect={hasbackgroundBlur}
            isBackgroundBlurLoading={isBackgroundBlurLoading}
          />
          <ShareScreenButton
            size={32}
            fontSize={16}
            style={{ marginRight: 8 }}
            screenShareClick={handleShareScreenClick}
            isSharing={sharing}
          />
          <ControlButton.CycleCamera
            publisher={publisher}
            size={32}
            fontSize={16}
            style={{ marginRight: 8, marginBottom: 8 }}
          />
          <RoomControlButton
              size={32}
              fontSize={16}
              style={{ marginRight: 8, marginBottom: 8 }}
            />
        </>
      }
    />
  );
}
export default ModeratorParticipantItem;
