// @flow
import React from "react";
import PollingAPI from "api/polling";
import useSession from "hooks/session";
import type { Node } from "react";
import type { ICreate } from "api/polling";
import type { IPoll } from "api/polling";
import type { IRetrieveSelected } from "api/polling";
import { io } from "socket.io-client";

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

  // Subscribe to WebSocket stream for real-time poll updates
  React.useEffect(() => {
    if (!session) return;
    
    const socket = io(config.apiURL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    socket.on("connect", () => {
      console.log("[PollingProvider] Connected to WebSocket");
      socket.emit("join:session", session.id);
    });

    socket.on("polls:update", (data) => {
      try {
        console.log("[PollingProvider] Received polls update:", data);
        setPolling(data && data.length > 0 ? Polling.fromResponse(data[0]) : undefined);
      } catch (e) {
        console.error("WebSocket polls parse error", e);
      }
    });

    socket.on("error", (error) => {
      console.error("[PollingProvider] WebSocket error:", error);
    });

    return () => {
      socket.emit("leave:session", session.id);
      socket.disconnect();
    };
  }, [ session ]);

  // retrieve is a no-op — WebSocket keeps polling state current
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
