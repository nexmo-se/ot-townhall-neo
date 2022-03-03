// @flow
import React from 'react';

import useMe from 'hooks/me';
import User from 'entities/user';
import { useHistory, useParams } from 'react-router-dom';

import SessionProvider from 'contexts/session';
import MessageProvider from 'contexts/message';

import Main from './components/Main';
import SelectedQuestion from 'components/SelectedQuestion';
import PageWrapper from 'components/PageWrapper';

interface IParam {
  tenant: string;
}
function PresenterPage() {
  const { loggedIn, login } = useMe();
  const { push } = useHistory();
  const { tenant } = useParams<IParam>();

  const handleLoggedIn = React.useCallback(async (): Promise<void> => {
    login(new User({ name: 'Ghost Rider', role: 'participant' }));
    push(`/${tenant}/ghostrider`);
  }, [login, push, tenant]);

  React.useEffect(() => {
    if (!loggedIn) {
      handleLoggedIn();
    }
  }, [loggedIn, push, tenant]);

  /* React.useEffect(() => {
    console.log('hi');
    if (!loggedIn) {
      console.log('hi2');
      push(`/${tenant}/ghostrider/login`);
    }
  }, [loggedIn, push, tenant]); */

  return (
    <SessionProvider>
      <MessageProvider>
        <PageWrapper>
          <SelectedQuestion />
          <Main />
        </PageWrapper>
      </MessageProvider>
    </SessionProvider>
  );
}
export default PresenterPage;
