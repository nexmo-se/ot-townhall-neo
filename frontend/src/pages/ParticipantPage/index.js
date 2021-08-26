import React from "react";

import { useMe } from "components/MeProvider";
import { useState, useEffect, useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";

import SessionProvider from "contexts/session";
import MessageProvider from "contexts/message";
import PollingProvider from "contexts/polling";

import Main from "./components/Main";
import SelectedQuestion from "components/SelectedQuestion";
import PageWrapper from "components/PageWrapper";
import FullPageLoading from "components/FullPageLoading";
import ConfigurationService from "services/configuration";

function ParticipantPage () {
  const [isChecking, setIsChecking] = useState(true);
  const { loggedIn } = useMe();
  const { push } = useHistory();
  const { tenant } = useParams();

  /**
   * This function will check the current room configuration
   * if the room is open, it will not navigate to the lobby
   */
  const checkRoom = useCallback(
    async () => {
      const configuration = await ConfigurationService.retrieve({ tenant });
      if (configuration.status === "open") setIsChecking(false);
      else push(`/${tenant}/participant/lobby`)
    },
    [tenant, push]
  )

  useEffect(
    () => {
      if (!loggedIn) push(`/${tenant}/participant/login`);
      else if (loggedIn) checkRoom();
    },
    [loggedIn, push, tenant, checkRoom]
  );

  if (isChecking) return <FullPageLoading />
  else {
    return (
      <SessionProvider>
        <MessageProvider>
          <PollingProvider>
            <PageWrapper>
              <SelectedQuestion />
              < Main />
            </PageWrapper>
          </PollingProvider>
        </MessageProvider>
      </SessionProvider>
    )
  }
}
export default ParticipantPage;