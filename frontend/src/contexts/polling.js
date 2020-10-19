// @flow
import React from "react";
import PollingAPI from "api/polling";
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
  retrieve: (args: { sessionID: string }) => Promise<void>;
  start: (args: { sessionID: string }) => Promise<void>;
  stop: (args: { sessionID: string }) => Promise<void>;
  poll: (args: IPoll) => Promise<void>;
  retrieveSelected: (args: IRetrieveSelected) => Promise<PollingItem>
}

export const PollingContext = React.createContext<IPollingContext>({
  polling: undefined,
  create: (args: ICreate) => Promise.resolve(),
  retrieve: ({ sessionID: string }) => Promise.resolve(),
  start: ({ sessionID: string }) => Promise.resolve(),
  stop: ({ sessionID: string }) => Promise.resolve(),
  poll: (args: IPoll) => Promise.resolve(),
  retrieveSelected: (args: IRetrieveSelected) => Promise.resolve(new PollingItem({ option: "" }))
});

export default function PollingProvider({ children }: IPollingProvider){
  const [ polling, setPolling ] = React.useState<Polling | void>();

  async function create({ title, items }: ICreate){
    PollingAPI.create({ title, items })
  }

  async function start({ sessionID }: { sessionID: string }){
    PollingAPI.start({ sessionID });
  }

  async function stop({ sessionID }: { sessionID: string }){
    PollingAPI.stop({ sessionID });
  }

  async function poll({ id, itemID, user }: IPoll){
    PollingAPI.poll({ id, itemID, user });
  }

  const retrieveSelected = React.useCallback(async ({ id, user }: IRetrieveSelected): Promise<PollingItem> => {
    const selected = await PollingAPI.retireveSelected({ id, user });
    return selected;
  }, [])

  const retrieve = React.useCallback(async ({ sessionID }: { sessionID: string }) => {
    const polling = await PollingAPI.retrieve({ sessionID });
    setPolling(polling);
  }, []);

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