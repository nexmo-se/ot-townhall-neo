// @flow
import React from "react";

import useMe from "hooks/me";
import { useHistory, useParams } from "react-router-dom";

import SessionProvider from "contexts/session";
import MessageProvider from "contexts/message";

import Main from "./components/Main";
import SelectedQuestion from "components/SelectedQuestion";
import PageWrapper from "components/PageWrapper";

interface IParam { tenant: string }
function PresenterPage(){
  const { loggedIn } = useMe();
  const { push } = useHistory();
  const { tenant } = useParams<IParam>();

  React.useEffect(() => {
    if(!loggedIn) push(`/${tenant}/ghostrider/login`);
  }, [ loggedIn, push, tenant ]);

  return (
    <SessionProvider>
      <MessageProvider>
        <PageWrapper>
          <SelectedQuestion />
          <Main />
        </PageWrapper>
      </MessageProvider>
    </SessionProvider>
  )
}
export default PresenterPage;