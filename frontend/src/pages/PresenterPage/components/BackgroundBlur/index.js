// @flow
import React from 'react';
import { Publisher } from '@opentok/client';

import useMe from 'hooks/me';
import useSession from 'hooks/session';

import BackgroundBlurButton from 'components/BackgroundBlurButton';

import * as VideoEffects from '@vonage/video-effects';
import CircularProgress from '@material-ui/core/CircularProgress';

const { BackgroundBlurEffect } = VideoEffects;

interface BackgroundBlurProps {
  publisher: Publisher;
  unpublish: any;
  publish: any;
}

function BackgroundBlur({
  publisher,
  unpublish,
  publish
}: BackgroundBlurProps) {
  const { connected, session } = useSession();
  const { me } = useMe();

  const [hasBackgroundBlurEffect, setHasBackgroundBlurEffect] =
    React.useState<boolean>(false);
  const [isBackgroundLoading, setIsBackgroundLoading] =
    React.useState<boolean>(false);

  const backgroundBlur = React.useRef(null);
  const localMediaTrack = React.useRef(null);
  const currentDeviceId = React.useRef(null);

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

      if (connected && session && me) {
        await publish({
          session,
          user: me,
          videoSource: currentDeviceId.current
        });
      }

      setHasBackgroundBlurEffect(true);
      setIsBackgroundLoading(false);
    } else {
      setIsBackgroundLoading(true);

      backgroundBlur.current.stopEffect();
      localMediaTrack.current.getTracks().forEach((t) => t.stop());

      await unpublish({ session: session });

      if (connected && session && me) {
        await publish({
          session,
          user: me,
          videoSource: currentDeviceId.current
        });
      }
      setHasBackgroundBlurEffect(false);
      setIsBackgroundLoading(false);
    }
  }

  if (isBackgroundLoading) {
    return (
      <CircularProgress
        style={{
          marginRight: 12,
          marginLeft: 4
        }}
      />
    );
  }

  return (
    <BackgroundBlurButton
      style={{ marginRight: 8 }}
      onClick={handleBackgroundBlurEffectClick}
      hasBackgroundBlurEffect={hasBackgroundBlurEffect}
    />
  );
}
export default BackgroundBlur;
