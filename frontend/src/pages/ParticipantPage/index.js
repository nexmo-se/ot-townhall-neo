// @flow
import React from "react";

import useMe from "hooks/me";
import { useHistory, useParams } from "react-router-dom";

import SessionProvider from "contexts/session";
import MessageProvider from "contexts/message";
import PollingProvider from "contexts/polling";
import Main from "./components/Main";

interface IParam { tenant: string }
function ParticipantPage(){
  const { loggedIn } = useMe();
  const { push } = useHistory();
  const { tenant } = useParams<IParam>();

  React.useEffect(() => {
    if(!loggedIn) push(`/${tenant}/participant/login`);
  }, [ loggedIn, push, tenant ]);

  return (
    <SessionProvider>
      <MessageProvider>
        <PollingProvider>
        < Main />
        </PollingProvider>
      </MessageProvider>
    </SessionProvider>
  )
}
export default ParticipantPage;