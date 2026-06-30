// @flow
import React from "react";
import FetchHelper from "helper/fetch";

import useRecording from "../../hooks/recording";
import useStyles from "./styles";
import useSession from "hooks/session";

import RecordingItem from "../RecordingItem";
import Button from "components/Button";

function RecordingPanel(){
  const [ fetching, setFetching ] = React.useState<boolean>(false);
  const { session } = useSession();
  const { data, fetch } = useRecording();
  const mStyles = useStyles();

  function handleRefresh() {
    if(session) {
      FetchHelper.fetch(fetch, setFetching, { sessionID: session.id });
    }
  }

  React.useEffect(() => {
    if(session) {
      FetchHelper.fetch(fetch, setFetching, { sessionID: session.id });
    }
  }, [session, fetch])
  
  return (
    <div className={mStyles.container}>
      <Button 
        text="Refresh"
        className="Vlt-btn--tertiary"
        onClick={handleRefresh}
        disabled={fetching}
      />

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