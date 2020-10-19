// @flow
import React from "react";
import FetchHelper from "helper/fetch";

import useSession from "hooks/session";
import usePolling from "hooks/polling";

import PollResultItem from "../PollResultItem";
import Button from "components/Button";

function ViewPoll(){
  const [ loading, setLoading ] = React.useState<boolean>(false);
  const { polling, retrieve: retrievePolling, start: startPolling, stop: stopPolling } = usePolling();
  const { session } = useSession();

  React.useEffect(() => {    
    console.log(session);
    if(session) FetchHelper.fetch(retrievePolling, setLoading, { sessionID: session.id });
  }, [ session, retrievePolling ]);

  if(loading) return <>Loading...</>
  return (
    <>
      <strong>{polling?.title}</strong>
      {polling?.items?.map((item) => (
        <PollResultItem key={item.id} item={item} />
      ))}
      {polling?.status === "pending"? (
        <Button text="Start Polling" onClick={startPolling} /> 
      ): polling?.status === "started"? (
        <Button className="Vlt-btn--destructive" text="Stop Polling" onClick={stopPolling} />
      ): null}
    </>
  )
}
export default ViewPoll