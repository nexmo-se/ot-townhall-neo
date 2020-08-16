// @flow
import React from "react";
import posed from "react-pose";
import clsx from "clsx";
import Recording from "entities/recording";
import RecordingAPI from "api/recording";
import { v4 as uuid } from "uuid";

import useStyles from "./styles";
import useSession from "hooks/session";

import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import StopIcon from '@material-ui/icons/Stop';

type Props = {
  size: number,
  fontSize: number
}

function RecordButton({ size, fontSize, ...props }:Props){
  const [ isBig, setIsBig ] = React.useState<boolean>(false);
  const [ isRecording, setIsRecording ] = React.useState<boolean>(false);
  const [ recording, setRecording ] = React.useState<Recording|void>();
  const [ refreshStatus, setRefreshStatus ] = React.useState<string>(uuid());
  const mStyles = useStyles({ size, fontSize });
  const mSession = useSession();

  const Container = posed.div({
    big: { scale: 1.1 },
    small: { scale: 1 }
  });

  function handleMouseEnter(){ setIsBig(true) }
  function handleMouseLeave(){ setIsBig(false) }
  async function handleClick(){
    if(isRecording) {
      await RecordingAPI.stopRecording(recording);
      setIsRecording(false);
    }else {
      const recording = await RecordingAPI.startRecording(mSession.session);
      setRecording(recording);
      
      const layoutType = RecordingAPI.retrieveLayoutType(mSession.streams);
      if(layoutType === "presentation"){
        const presentationStreams = RecordingAPI.retrievePresentationStreams(mSession.streams);
        await RecordingAPI.setPresentationLayout(recording, presentationStreams);
      }else await RecordingAPI.setBestFitLayout(recording);
    }
    setRefreshStatus(uuid());
  }
  
  React.useEffect(() => {
    async function fetchSatus(){
      const { session } = mSession;
      if(session){
        const { sessionId: sessionID } = session;
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
    }
    
    fetchSatus();
  }, [ mSession.session, refreshStatus ]);

  return (
    <Container 
      {...props}
      pose={isBig? "big": "small"} 
      className={clsx({
        "Vlt-bg-red": !isRecording,
        "Vlt-bg-green": isRecording,
        "Vlt-white": true,
        [mStyles.root]: true
      })}
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave} 
      onClick={handleClick}
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