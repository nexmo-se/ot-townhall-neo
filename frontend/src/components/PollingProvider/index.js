import { PollingContext } from "./contexts/polling";

import PollingService from "./services/polling";
import SignalService from "services/signal";

import Polling from "./models/polling";
import PollingItem from "./models/polling-item";

import { useSession } from "components/OT";
import { useCallback, useEffect, useState } from "react";

function PollingProvider ({ children }) {
  const [polling, setPolling] = useState();
  const { session } = useSession();

  const retrieve = useCallback(
    async () => {
      if (!session) return;

      const polling = await PollingService.retrieve({ sessionId: session.id });
      setPolling(polling);
    },
    [session]
  );

  const retrieveSelected  = useCallback(
    async ({ id, user }) => {
      const selected = await PollingService.retrieveSelected({ id, user });
      return selected;
    },
    []
  )

  async function reset () {
    if (!session) return;
    await PollingService.reset({ sessionId: session.id });
    setPolling(undefined);
  }

  async function create ({ title, items }) {
    if (!session) return;

    await PollingService.create({
      sessionId: session.id,
      title,
      items
    });

    await retrieve();
  }

  /**
   * Send a signal to all participants that the polling start
   */
  async function signalStart () {
    SignalService.signal({
      type: "start-polling",
      session
    });
  }

  /**
   * Send a signal to all participants that the polling stop
   */
  async function signalStop () {
    SignalService.signal({
      type: "stop-polling",
      session
    });
  }

  async function start () {
    if (!polling) return;
    await PollingService.start({ pollingId: polling.id });
    await retrieve();
    await signalStart();
  }

  async function stop () {
    if (!polling) return;
    await PollingService.stop({ pollingId: polling.id });
    await retrieve();
    await signalStop()
  }

  async function poll ({ id, itemId, user }) {
    await PollingService.poll({ id, itemId, user });
    await retrieve();
  }

  // First time load, we need to retrieve the polling
  useEffect(
    () => {
      retrieve();
    },
    [retrieve]
  )

  return (
    <PollingContext.Provider
      value={{
        polling,
        create,
        retrieve,
        retrieveSelected,
        start,
        stop,
        poll,
        reset
      }}
    >
      {children}
    </PollingContext.Provider>
  )
}


export { usePolling } from "./hooks/polling";
export { Polling, PollingItem };
export default PollingProvider;
