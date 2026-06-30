// @flow
import React from 'react';
import { Publisher } from '@opentok/client';

import useMe from 'hooks/me';
import useSession from 'hooks/session';

import BackgroundBlurButton from 'components/BackgroundBlurButton';

import * as VideoEffects from '@vonage/video-effects';

const { BackgroundBlurEffect } = VideoEffects;

interface BackgroundBlurProps {
  publisher: Publisher;
  unpublish: any;
  publish: any;
}

function BackgroundBlur({
  publisher,
  unpublish,
  publish,
  hasBackgroundBlurEffect,
  setHasBackgroundBlurEffect
}: BackgroundBlurProps) {
  const { connected, session } = useSession();
  const { me } = useMe();

  const [isBackgroundLoading, setIsBackgroundLoading] =
    React.useState<boolean>(false);

  const backgroundBlur = React.useRef(null);
  const localMediaTrack = React.useRef(null);
  const currentDeviceId = React.useRef(null);
  const domCameraContainer = document.getElementById("cameraContainer");

  const getUserMedia = async () => {
    try {
      currentDeviceId.current = publisher.getVideoSource().deviceId;
      const track = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: currentDeviceId.current }
      });

      localMediaTrack.current = track;
      // return track;
    } catch (e) {
      console.log('OT get user media error ' + e);
    }
  };

  async function handleBackgroundBlurEffectClick() {
    if (!hasBackgroundBlurEffect) {
      setIsBackgroundLoading(true);
      await unpublish({ session });

      await getUserMedia();

      backgroundBlur.current = new BackgroundBlurEffect({
        assetsPath: process.env.REACT_APP_ASSETS_PATH
      });

      await backgroundBlur.current.loadModel();

      const outputStream = backgroundBlur.current.startEffect(
        localMediaTrack.current
      );

      domCameraContainer.classList.add("background-blur");

      if (connected && session && me) {
        await publish({
          session,
          user: me,
          videoSource: outputStream.getVideoTracks()[0]
        });
      }

      setHasBackgroundBlurEffect(true);
    } else {
      setIsBackgroundLoading(true);

      await unpublish({ session: session });

      domCameraContainer.classList.remove("background-blur");

      if (connected && session && me) {
        await publish({
          session,
          user: me,
          videoSource: currentDeviceId.current
        });
      }

      setHasBackgroundBlurEffect(false);
    }
  }

  return (
    <BackgroundBlurButton
      style={{ marginRight: 8 }}
      onClick={handleBackgroundBlurEffectClick}
      hasBackgroundBlurEffect={hasBackgroundBlurEffect}
      isBackgroundBlurLoading={isBackgroundLoading}
    />
  );
}
export default BackgroundBlur;
