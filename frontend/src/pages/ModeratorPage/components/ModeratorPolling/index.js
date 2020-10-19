// @flow
import React from "react";
import FetchHelper from "helper/fetch";

import usePolling from "hooks/polling";
import useSession from "hooks/session";

import CreatePoll from "../CreatePoll";
import ViewPoll from "../ViewPoll";

function ModeratorPolling(){
  const [ loading, setLoading ] = React.useState<boolean>(true);
  const { session } = useSession();
  const { polling, retrieve: retrievePolling } = usePolling();

  React.useEffect(() => {
    if(session) FetchHelper.fetch(retrievePolling, setLoading);
  }, [ session, retrievePolling ])

  if(loading) return <>Loading...</>
  else if(polling) return <ViewPoll />
  else return <CreatePoll />
}
export default ModeratorPolling;