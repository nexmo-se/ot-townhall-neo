// @flow
import React from "react";

import useMe from "hooks/me";
import { useHistory, useParams } from "react-router-dom";

import SessionProvider from "contexts/session";
import MessageProvider from "contexts/message";
import PollingProvider from "contexts/polling";

import Main from "./components/Main";
import SelectedQuestion from "components/SelectedQuestion";
import PageWrapper from "components/PageWrapper";

import ConfigurationService from "services/configuration";

interface IParam { tenant: string }
function ParticipantPage () {
  const [isChecking, setIsChecking] = React.useState<Boolean>(true);
  const [roomState, setRoomState] = React.useState<Boolean>('locked');
  const { loggedIn } = useMe();
  const { push } = useHistory();
  const { tenant } = useParams<IParam>();

  /**
   * This function will check the current room configuration
   * if the room is open, it will not navigate to the lobby
   */
    const checkRoom = React.useCallback(
    async () => {
      const configuration = await ConfigurationService.retrieve({ tenant });
      if (configuration.state.status === "open") {
        setIsChecking(false);
        setRoomState(configuration.state.status)
      }
      else push(`/${tenant}/participant/lobby`)
    },
    [tenant, push]
  )

  React.useEffect(() => {
    if(!loggedIn) push(`/${tenant}/participant/login`);
    else if (loggedIn) checkRoom();
  }, [ loggedIn, push, tenant, checkRoom ]);

  return (
    <SessionProvider>
      <MessageProvider>
        <PollingProvider>
          <PageWrapper>
            <SelectedQuestion />
            {roomState === 'open' ? < Main /> : ''}
          </PageWrapper>
        </PollingProvider>
      </MessageProvider>
    </SessionProvider>
  )
}
export default ParticipantPage;