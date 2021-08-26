import React from "react";

import { useMe } from "components/MeProvider";
import { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";

import SessionProvider from "contexts/session";
import MessageProvider from "contexts/message";
import PollingProvider from "contexts/polling";

import Main from "./components/Main";
import SelectedQuestion from "components/SelectedQuestion";
import PageWrapper from "components/PageWrapper";

function ParticipantPage () {
  const { loggedIn } = useMe();
  const { push } = useHistory();
  const { tenant } = useParams();

  useEffect(
    () => {
      if (!loggedIn) push(`/${tenant}/participant/login`);
      else if (loggedIn) {
        // Force go to the lobby
        // TODO: get the room configuration
        push(`/${tenant}/participant/lobby`)
      }
    },
    [loggedIn, push, tenant]
  );

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
export default ParticipantPage;