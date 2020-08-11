// @flow
import React from 'react';

import SessionProvider from 'contexts/session';
import { BrowserRouter, Switch, Route } from "react-router-dom";

import PresenterPage from "pages/PresenterPage";
import ParticipantPage from "pages/ParticipantPage";
import ModeratorPage from "pages/ModeratorPage";
import GhostRiderPage from "pages/GhostRiderPage";
import MessageProvider from 'contexts/message';

function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <MessageProvider>
          <Switch>
            <Route path="/presenter" component={PresenterPage} />
            <Route path="/participant" component={ParticipantPage} />
            <Route path="/moderator" component={ModeratorPage} />
            <Route path="/ghostrider" component={GhostRiderPage} />
          </Switch>
        </MessageProvider>
      </SessionProvider>
    </BrowserRouter>
  );
}

export default App;
