// @flow
import React from "react";
import FetchHelper from "helper/fetch";

import usePolling from "hooks/polling";
import useSession from "hooks/session";

import CreatePoll from "../CreatePoll";
import ViewPoll from "../ViewPoll";

interface IModeratorPolling {
  refresh: boolean;
}

function ModeratorPolling({ refresh }: IModeratorPolling){
  const [ loading, setLoading ] = React.useState<boolean>(true);
  const { session } = useSession();
  const { polling, retrieve: retrievePolling } = usePolling();

  React.useEffect(() => {
    if(session) FetchHelper.fetch(retrievePolling, setLoading);
  }, [ session, retrievePolling, refresh ])

  if(loading) return <>Loading...</>
  else if(polling) return <ViewPoll />
  else return <CreatePoll />
}
export default ModeratorPolling;