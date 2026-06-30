// @flow
import React from "react";
import PollingAPI from "api/polling";
import useSession from "hooks/session";
import type { Node } from "react";
import type { ICreate } from "api/polling";
import type { IPoll } from "api/polling";
import type { IRetrieveSelected } from "api/polling";

import config from "config";
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

  // Subscribe to SSE stream for real-time poll updates
  React.useEffect(() => {
    if (!session) return;
    const url = `${config.apiURL}/pollings/stream?session_id=${session.id}`;
    const es = new EventSource(url);
    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setPolling(data && data.length > 0 ? Polling.fromResponse(data[0]) : undefined);
      } catch (e) {
        console.error("SSE polling parse error", e);
      }
    };
    es.onerror = () => {};
    return () => es.close();
  }, [ session ]);

  // retrieve is a no-op — SSE keeps polling state current
  const retrieve = React.useCallback(() => Promise.resolve(), []);

  async function create({ title, items }: ICreate){
    await PollingAPI.create({ sessionID: session.id, title, items });
  }

  async function start(){
    if(polling) await PollingAPI.start({ pollingID: polling.id });
  }

  async function stop(){
    if(polling) await PollingAPI.stop({ pollingID: polling.id });
  }

  async function poll({ id, itemID, user }: IPoll){
    await PollingAPI.poll({ id, itemID, user });
  }

  const retrieveSelected = React.useCallback(async ({ id, user }: IRetrieveSelected): Promise<PollingItem> => {
    return PollingAPI.retireveSelected({ id, user });
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
