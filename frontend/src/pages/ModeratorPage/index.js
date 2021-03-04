// @flow
import React from "react";

import useMe from "hooks/me";
import { useHistory, useParams } from "react-router-dom";

import VODProvider from "./contexts/vod";
import SessionProvider from "contexts/session";
import MessageProvider from "contexts/message";
import PollingProvider from "contexts/polling";

import Main from "./components/Main";
import SelectedQuestion from "components/SelectedQuestion";
import PageWrapper from "components/PageWrapper";

interface IParam { tenant: string };
function ModeratorPage(){
  const { loggedIn } = useMe();
  const { push } = useHistory();
  const { tenant } = useParams<IParam>();

  React.useEffect(() => {
    if(!loggedIn) push(`/${tenant}/moderator/login`);
  }, [ loggedIn, push, tenant ]);

  return (
    <SessionProvider
      subscriberContainer={{
        camera: "cameraContainer",
        moderator: "cameraContainer",
        screen: "cameraContainer",
        custom: "cameraContainer"
      }}
    >
      <MessageProvider>
        <PollingProvider>
          <VODProvider>
            <PageWrapper>
              <SelectedQuestion />
              <Main />
            </PageWrapper>
          </VODProvider>
        </PollingProvider>
      </MessageProvider>
    </SessionProvider>
  )
}
export default ModeratorPage;
