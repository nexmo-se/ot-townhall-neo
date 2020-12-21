// @flow
import React from "react";
import User from "entities/user";
import FetchHelper from "helper/fetch";
import EPollingItem from "entities/polling-item";

import useStyles from "./styles";
import useSession from "hooks/session";
import usePolling from "hooks/polling";
import PollingItem from "../PollingItem";

function PollingPanel(){
  const [ pollingLoading, setPollingLoading ] = React.useState<boolean>(false);
  const [ selectedLoading, setSelectedLoading ] = React.useState<boolean>(false);
  const [ selected, setSelected ] = React.useState<EPollingItem | void>();
  const { session } = useSession();
  const { polling, retrieve: retrievePolling, poll, retrieveSelected } = usePolling();
  const mStyles = useStyles();

  function handlePollClick(item: EPollingItem){
    const user = User.fromConnection(session.connection);
    if(polling) poll({ id: polling.id, itemID: item.id, user });
    setSelected(item);
  }

  const startPollingListener = React.useCallback(() => {
    FetchHelper.fetch(retrievePolling, setPollingLoading);
  }, [ retrievePolling ])

  const stopPollingListener = React.useCallback(() => {
    FetchHelper.fetch(retrievePolling, setPollingLoading);
  }, [retrievePolling ])

  React.useEffect(() => {
    if(session) FetchHelper.fetch(retrievePolling, setPollingLoading);
  }, [ session, retrievePolling ])

  React.useEffect(() => {
    async function fetchSelected(){
      if(polling && session){
        const user = User.fromConnection(session.connection);
        const selected = await FetchHelper.fetch(retrieveSelected, setSelectedLoading, { id: polling.id, user });
        console.log(selected);
        setSelected(selected);
      }
    }
    fetchSelected();
  }, [ polling, session, retrieveSelected ]);

  React.useEffect(() => {
    if(session) session.on("signal:start-polling", startPollingListener);
    if(session) session.on("signal:stop-polling", stopPollingListener);
    return function cleanup(){
      if(session) session.off("signal:start-polling", startPollingListener);
      if(session) session.off("signal:stop-polling", stopPollingListener);
    }
  }, [ session, startPollingListener, stopPollingListener ])

  if(pollingLoading || selectedLoading) return <>Please wait...</>
  else if(!polling || polling.status === "pending") return <>You don't have polling at the moment</>
  else return (
    <>
      <p>Moderator is starting a polling. Please put your answer by clicking the buttons below.</p>
      <p>Please note that you are only able to provide answer once.</p>
      <strong>{polling.title}</strong>
      <div className={mStyles.pollContainer}>
        {polling.items.sort((a, b) => {
          if(a.orderNumber > b.orderNumber) return 1;
          else if(a.orderNumber < b.orderNumber) return -1;
          else return 0;
        }).map((item) => (
          <PollingItem 
            disabled={selected? true: false}
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