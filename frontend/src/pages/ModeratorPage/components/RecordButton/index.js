// @flow
import React from "react";
import Recording from "entities/recording";
import RecordingAPI from "api/recording";
import { v4 as uuid } from "uuid";

import useSession from "hooks/session";

import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import StopIcon from '@material-ui/icons/Stop';
import ControlButton from "components/ControlButton";

interface IRecordButton {
  size: number,
  fontSize: number
}

function RecordButton({ ...props }: IRecordButton){
  const [ isRecording, setIsRecording ] = React.useState<boolean>(false);
  const [ recording, setRecording ] = React.useState<Recording | void>();
  const [ refreshStatus, setRefreshStatus ] = React.useState<string>(uuid());
  const [ disabled, setDisabled ] = React.useState<boolean>(true);
  const mSession = useSession();

  async function handleClick(){
    setDisabled(true);
    if(isRecording && recording) {
      await RecordingAPI.stopRecording(recording);
      setIsRecording(false);
      setRecording(undefined);
    }else {
      const recording = await RecordingAPI.startRecording(mSession.session);
      setIsRecording(true);
      setRecording(recording);
    }
    setRefreshStatus(uuid());
  }
  
  React.useEffect(() => {
    async function fetchSatus(){
      setDisabled(true);
      if(mSession.session){
        const { sessionId: sessionID } = mSession.session;
        const [ recording ] = await RecordingAPI.retrieveActive(sessionID);
        if(recording){
          const status = await RecordingAPI.retrieveStatus(recording);
          if(status === "started" || status === "paused") {
            setIsRecording(true);
            setRecording(recording)
          }else {
            setIsRecording(false);
            setRecording(undefined);
          }
        }
      }
      setDisabled(false);
    }
    
    fetchSatus();
  }, [ mSession.session, refreshStatus ]);
  
  React.useEffect(() => {
    async function updateLayout(){
      if(recording && isRecording){
        const layoutType = RecordingAPI.retrieveLayoutType(mSession.streams);
        if(layoutType === "presentation"){
          const presentationStreams = RecordingAPI.retrievePresentationStreams(mSession.streams);
          await RecordingAPI.setPresentationLayout(recording, presentationStreams);
        }else await RecordingAPI.setBestFitLayout(recording);
      }
    }
    updateLayout();
  }, [ mSession.streams, recording, isRecording ]);

  return (
    <ControlButton 
      {...props}
      disabled={disabled}
      active={isRecording}
      tooltip={isRecording? "Stop Record": "Start Record"}
      onClick={handleClick}
    >
      {isRecording? <StopIcon fontSize="inherit"/>: <FiberManualRecordIcon fontSize="inherit"/>}
    </ControlButton>
  )
}

RecordButton.defaultProps = { size: 50, fontSize: 24 }
export default RecordButton;