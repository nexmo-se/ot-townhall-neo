// @flow
import React from "react";
import PollingAPI from "api/polling";
import useSession from "hooks/session";
import type { Node } from "react";
import type { ICreate } from "api/polling";
import type { IPoll } from "api/polling";
import type { IRetrieveSelected } from "api/polling";

import Polling from "entities/polling";
import PollingItem from "entities/polling-item";

interface IPollingProvider { children?: Node }
interface IPollingContext { 
  polling: Polling | void;
  create: (args: ICreate) => Promise<void>;
  retrieve: () => Promise<void>;
  start: () => Promise<void>;
  stop: () => Promise<void>;
  poll: (args: IPoll) => Promise<void>;
  retrieveSelected: (args: IRetrieveSelected) => Promise<PollingItem>
}

export const PollingContext = React.createContext<IPollingContext>({
  polling: undefined,
  create: (args: ICreate) => Promise.resolve(),
  retrieve: () => Promise.resolve(),
  start: () => Promise.resolve(),
  stop: () => Promise.resolve(),
  poll: (args: IPoll) => Promise.resolve(),
  retrieveSelected: (args: IRetrieveSelected) => Promise.resolve(new PollingItem({ option: "", orderNumber: 0 }))
});

export default function PollingProvider({ children }: IPollingProvider){
  const [ polling, setPolling ] = React.useState<Polling | void>();
  const { session } = useSession();

  const retrieve = React.useCallback(async () => {
    try{
      const polling = await PollingAPI.retrieve({ sessionID: session.id });
      setPolling(polling);
    } catch (err) {
      setPolling(undefined);
    }
  }, [ session ]);

  async function create({ title, items }: ICreate){
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

  async function poll({ id, itemID, user }: IPoll){
    await PollingAPI.poll({ id, itemID, user });
    await retrieve();
  }

  const retrieveSelected = React.useCallback(async ({ id, user }: IRetrieveSelected): Promise<PollingItem> => {
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