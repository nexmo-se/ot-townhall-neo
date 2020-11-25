// @flow
import React from "react";
import FetchHelper from "helper/fetch";
import clsx from "clsx";

import useStyles from "./styles";
import useSession from "hooks/session";
import usePolling from "hooks/polling";
import useMessage from "hooks/message";

import PollResultItem from "../PollResultItem";
import Button from "components/Button";

function ViewPoll(){
  const [ loading, setLoading ] = React.useState<boolean>(false);
  const [ sendingSignal, setSendingSignal ] = React.useState<boolean>(false);
  const { 
    polling, 
    retrieve: retrievePolling, 
    start: startPolling, 
    stop: stopPolling 
  } = usePolling();

  const { 
    startPolling: signalStartPolling, 
    stopPolling: signalStopPolling 
  } = useMessage();

  const { session } = useSession();
  const mStyles = useStyles();

  function refreshClick(){
    if(session) FetchHelper.fetch(retrievePolling, setLoading);
  }

  async function start() {
    await startPolling();
    await signalStartPolling();
  }

  async function stop() {
    await stopPolling();
    await signalStopPolling();
  }

  async function handleStartClick(){
    FetchHelper.fetch(start, setSendingSignal);
  }

  async function handleStopClick(){
    FetchHelper.fetch(stop, setSendingSignal); 
  }

  React.useEffect(() => {    
    if(session) FetchHelper.fetch(retrievePolling, setLoading);
  }, [ session, retrievePolling ]);

  if(loading) return <>Loading...</>
  return (
    <>
      <strong>{polling?.title}</strong>
      {polling?.items?.sort((a, b) => {
        if(a.orderNumber > b.orderNumber) return -1;
        else if(a.orderNumber < b.orderNumber) return 1;
        else return 0;
      })?.map((item) => (
        <PollResultItem key={item.id} item={item} />
      ))}
      <div className={mStyles.buttonContainer}>
        {polling?.status === "pending"? (
          <Button 
            className={mStyles.button} 
            text="Start Polling" 
            onClick={handleStartClick} 
            disabled={sendingSignal}
          /> 
        ): polling?.status === "started"? (
          <Button 
            className={clsx("Vlt-btn--destructive", mStyles.button)} 
            text="Stop Polling" 
            onClick={handleStopClick} 
            disabled={sendingSignal}
          />
        ): (
          <Button 
            className={clsx("Vlt-btn--primary", mStyles.button)} 
            text="Please wait" 
            disabled
          />
        )}
      </div>
      <Button 
        text="Refresh" 
        className={clsx(
          "Vlt-btn--tertiary",
          mStyles.refreshButton
        )} 
        onClick={refreshClick}
        disabled={sendingSignal}
      />
    </>
  )
}
export default ViewPoll