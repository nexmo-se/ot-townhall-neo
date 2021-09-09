import React from "react";

import { useMe } from "components/MeProvider";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import VODProvider from "./contexts/vod";
import SessionProvider from "contexts/session";
import MessageProvider from "contexts/message";
import PollingProvider from "contexts/polling";

import Main from "./components/Main";
import SelectedQuestion from "components/SelectedQuestion";
import PageWrapper from "components/PageWrapper";
import FullPageLoading from "components/FullPageLoading";

function ModeratorPage () {
  const [isChecking, setIsChecking] = useState(true);
  const { loggedIn } = useMe();
  const { push } = useHistory();
  const { tenant } = useParams();

  useEffect(
    () => {
      if (!loggedIn) push(`/${tenant}/moderator/login`);
      else {
        setIsChecking(false);
      }
    },
    [loggedIn, push, tenant]
  );

  if (isChecking) {
    return <FullPageLoading />
  } else {
    return (
      <Main />
      // <SessionProvider
      //   subscriberContainer={{
      //     camera: "cameraContainer",
      //     moderator: "cameraContainer",
      //     screen: "cameraContainer",
      //     custom: "cameraContainer"
      //   }}
      // >
      //   <MessageProvider>
      //     <PollingProvider>
      //       <VODProvider>
      //         <PageWrapper>
      //           <SelectedQuestion />
      //           <Main />
      //         </PageWrapper>
      //       </VODProvider>
      //     </PollingProvider>
      //   </MessageProvider>
      // </SessionProvider>
    )
  }
}
export default ModeratorPage;
