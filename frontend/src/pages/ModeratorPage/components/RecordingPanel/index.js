// @flow
import React from "react";
import Recording from "entities/recording";

import useStyles from "./styles";
import useRecording from "../../hooks/recording";

import RecordingItem from "../RecordingItem";

function RecordingPanel(){
  const { data, fetch } = useRecording();
  const mStyles = useStyles();

  React.useEffect(() => {
    fetch();
  }, [fetch])
  
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