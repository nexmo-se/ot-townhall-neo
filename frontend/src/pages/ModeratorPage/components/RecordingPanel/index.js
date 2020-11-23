// @flow
import React from "react";

import useRecording from "../../hooks/recording";
import useStyles from "./styles";
import useSession from "hooks/session";

import RecordingItem from "../RecordingItem";

function RecordingPanel(){
  const { session } = useSession();
  const { data, fetch } = useRecording();
  const mStyles = useStyles();

  React.useEffect(() => {
    if(session) fetch({ sessionID: session.id });
  }, [session, fetch])
  
  return (
    <div className={mStyles.container}>
      { data.map((recording) => (
        <RecordingItem 
          key={recording.id}
          recording={recording}
        />
      ))}
    </div>
  )
}
export default RecordingPanel;