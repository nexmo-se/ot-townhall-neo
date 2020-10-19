// @flow
import React from "react";
import posed from "react-pose";
import clsx from "clsx";
import lodash from "lodash";
import Recording from "entities/recording";
import RecordingAPI from "api/recording";
import { v4 as uuid } from "uuid";

import useStyles from "./styles";
import useSession from "hooks/session";

import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import StopIcon from '@material-ui/icons/Stop';

interface IRecordButton {
  size: number,
  fontSize: number
}

function RecordButton({ size, fontSize, ...props }: IRecordButton){
  const [ isBig, setIsBig ] = React.useState<boolean>(false);
  const [ isRecording, setIsRecording ] = React.useState<boolean>(false);
  const [ recording, setRecording ] = React.useState<Recording | void>();
  const [ refreshStatus, setRefreshStatus ] = React.useState<string>(uuid());
  const [ disabled, setDisabled ] = React.useState<boolean>(false);
  const mStyles = useStyles({ size, fontSize });
  const mSession = useSession();

  const Container = posed.div({
    big: { scale: 1.1 },
    small: { scale: 1 }
  });

  function handleMouseEnter(){ setIsBig(true) }
  function handleMouseLeave(){ setIsBig(false) }

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
    <Container 
      {...props}
      pose={isBig? "big": "small"} 
      disabled={disabled}
      className={clsx({
        "Vlt-bg-red": !isRecording && !disabled,
        "Vlt-bg-green": isRecording && !disabled,
        "Vlt-bg-grey-darker": disabled,
        "Vlt-white": true,
        [mStyles.root]: true,
        [mStyles.disabled]: disabled
      })}
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave} 
      onClick={lodash.debounce(handleClick, 3000, { leading: true, trailing: false })}
    >
      {isRecording?(
        <StopIcon fontSize="inherit" />
      ):(
        <FiberManualRecordIcon fontSize="inherit" />
      )}
    </Container>
  )
}

RecordButton.defaultProps = { size: 50, fontSize: 24 }
export default RecordButton;