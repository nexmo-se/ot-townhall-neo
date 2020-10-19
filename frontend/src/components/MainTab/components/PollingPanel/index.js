// @flow
import React from "react";
import FetchHelper from "helper/fetch";
import EPollingItem from "entities/polling-item";

import useStyles from "./styles";
import useSession from "hooks/session";
import usePolling from "hooks/polling";
import useMe from "hooks/me";
import PollingItem from "../PollingItem";

function PollingPanel(){
  const [ pollingLoading, setPollingLoading ] = React.useState<boolean>(false);
  const [ selectedLoading, setSelectedLoading ] = React.useState<boolean>(false);
  const [ selected, setSelected ] = React.useState<EPollingItem | void>();
  const { session } = useSession();
  const { polling, retrieve: retrievePolling, poll, retrieveSelected } = usePolling();
  const { me } = useMe();
  const mStyles = useStyles();

  function handlePollClick(item: EPollingItem){
    if(polling) poll({ id: polling.id, itemID: item.id, user: me });
    setSelected(item);
  }

  React.useEffect(() => {
    if(session) FetchHelper.fetch(retrievePolling, setPollingLoading, { sessionID: session.id });
  }, [ session, retrievePolling ])

  React.useEffect(() => {
    if(polling && me) FetchHelper.fetch(retrieveSelected, setSelectedLoading, { id: polling.id, user: me });
  }, [ polling, me, retrieveSelected ])

  if(pollingLoading || selectedLoading) return <>Please wait...</>
  else if(!polling) return <>You don't have polling at the moment</>
  else return (
    <>
      <p>Moderator is starting a polling. Please put your answer by clicking the buttons below.</p>
      <p>Please note that you only able to provide answer once.</p>
      <strong>{polling.title}</strong>
      <div className={mStyles.pollContainer}>
        {polling.items.map((item) => (
          <PollingItem 
            key={item.id}
            onClick={handlePollClick}
            item={item} 
            selected={item.id === selected?.id}
          />
        ))}
      </div>
    </>
  )
}
export default PollingPanel;