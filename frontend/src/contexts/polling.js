// TODO: The old Polling Provider is still being used here. Remove when no one is using

import React from "react";
import PollingAPI from "api/polling";
import useSession from "hooks/session";
import PollingItem from "entities/polling-item";

export const PollingContext = React.createContext({
  polling: undefined,
  create: (args) => Promise.resolve(),
  retrieve: () => Promise.resolve(),
  start: () => Promise.resolve(),
  stop: () => Promise.resolve(),
  poll: (args) => Promise.resolve(),
  retrieveSelected: (args) => Promise.resolve(new PollingItem({ option: "", orderNumber: 0 }))
});

export default function PollingProvider({ children }){
  const [ polling, setPolling ] = React.useState();
  const { session } = useSession();

  const retrieve = React.useCallback(async () => {
    try{
      const polling = await PollingAPI.retrieve({ sessionID: session.id });
      setPolling(polling);
    } catch (err) {
      setPolling(undefined);
    }
  }, [ session ]);

  async function create({ title, items }){
    await PollingAPI.create({ sessionID: session.id, title, items })
    await retrieve()
  }

  async function start(){
    if(polling) {
      await PollingAPI.start({ pollingID: polling.id });
      await retrieve()
    }
  }

  async function stop(){
    if(polling) {
      await PollingAPI.stop({ pollingID: polling.id });
      await retrieve()
    }
  }

  async function poll({ id, itemID, user }){
    await PollingAPI.poll({ id, itemID, user });
    await retrieve();
  }

  const retrieveSelected = React.useCallback(async ({ id, user }) => {
    const selected = await PollingAPI.retireveSelected({ id, user });
    return selected;
  }, [])

  return (
    <PollingContext.Provider value={{ 
      polling,
      create,
      retrieve,
      retrieveSelected,
      start,
      stop,
      poll
    }}>
      {children}
    </PollingContext.Provider>
  )
}