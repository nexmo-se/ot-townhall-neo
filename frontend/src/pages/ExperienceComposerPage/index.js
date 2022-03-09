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
    login(
      new User({ name: 'Experience Composer', role: 'experience-composer' })
    );
  }, [login, push, tenant]);

  React.useEffect(() => {
    if (!loggedIn) {
      handleLoggedIn();
    }
  }, [loggedIn, push, tenant]);

  return (
    <SessionProvider
      subscriberContainer={{
        camera: 'cameraContainer',
        moderator: 'moderatorContainer',
        screen: 'screenContainer',
        custom: 'cameraContainer'
      }}
    >
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
