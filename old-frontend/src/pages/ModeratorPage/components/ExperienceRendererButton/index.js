// @flow
import React from 'react';
import ExperienceRendererEntity from 'entities/experienceComposer';
import ExperienceRendererAPI from 'api/experienceRenderer';
import { v4 as uuid } from 'uuid';
import { useParams } from 'react-router-dom';

import useSession from 'hooks/session';

import Dvr from '@material-ui/icons/Dvr';
import StopIcon from '@material-ui/icons/Stop';
import ControlButton from 'components/ControlButton';
import CircularProgress from '@material-ui/core/CircularProgress';

interface IExperienceRenderer {
  size: number;
  fontSize: number;
}

interface IParam {
  tenant: string;
}

function ExperienceRenderer({ ...props }: IExperienceRenderer) {
  const [isRecording, setIsRecording] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [recording, setRecording] =
    React.useState<ExperienceRendererEntity | void>();
  const [refreshStatus, setRefreshStatus] = React.useState<string>(uuid());
  const [disabled, setDisabled] = React.useState<boolean>(true);
  const mSession = useSession();
  const { tenant } = useParams<IParam>();

  async function handleClick() {
    setDisabled(true);
    if (isRecording && recording) {
      console.log('Stop Recording', recording);
      setIsLoading(true);
      await ExperienceRendererAPI.stopRecording(recording.id);
      setIsRecording(false);
      setRecording(undefined);
      setIsLoading(false);
    } else {
      setIsLoading(true);
      const recording = await ExperienceRendererAPI.startExperienceRenderer(
        mSession.session,
        tenant
      );
      console.log('start experience', recording);
      setIsRecording(true);
      setRecording(recording);
      setIsLoading(false);
    }
    setRefreshStatus(uuid());
  }

  React.useEffect(() => {
    async function fetchSatus() {
      setDisabled(true);
      if (mSession.session) {
        const { sessionId: sessionID } = mSession.session;
        const recording = await ExperienceRendererAPI.retrieveActive(
          tenant,
          sessionID
        );
        if (recording) {
          //TODO get recording object
          /* const status = await ExperienceRendererAPI.retrieveActive(recording); */

          if (recording.length) {
            setIsRecording(true);
            setRecording(recording);
          } else {
            setIsRecording(false);
            setRecording(undefined);
          }
        }
      }
      setDisabled(false);
    }

    fetchSatus();
  }, [mSession.session, refreshStatus, tenant]);

  if (isLoading) {
    return <CircularProgress {...props} />;
  }
  return (
    <ControlButton
      {...props}
      disabled={disabled}
      active={isRecording}
      tooltip={isRecording ? 'Stop Renderer' : 'Start Renderer'}
      onClick={handleClick}
    >
      {isRecording ? (
        <StopIcon fontSize="inherit" />
      ) : (
        <Dvr fontSize="inherit" />
      )}
    </ControlButton>
  );
}

ExperienceRenderer.defaultProps = { size: 50, fontSize: 24 };
export default ExperienceRenderer;
