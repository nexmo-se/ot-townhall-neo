// @flow
import React from 'react';

import SessionProvider from 'contexts/session';
import MeProvider from "contexts/me";
import MessageProvider from 'contexts/message';
import { BrowserRouter, Switch, Route } from "react-router-dom";

import PresenterPage from "pages/PresenterPage";
import ParticipantPage from "pages/ParticipantPage";
import ModeratorPage from "pages/ModeratorPage";
import GhostRiderPage from "pages/GhostRiderPage";

function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <MessageProvider>
          <MeProvider>
            <Switch>
              <Route path="/presenter" component={PresenterPage} />
              <Route path="/participant" component={ParticipantPage} />
              <Route path="/moderator" component={ModeratorPage} />
              <Route path="/ghostrider" component={GhostRiderPage} />
            </Switch>
          </MeProvider>
        </MessageProvider>
      </SessionProvider>
    </BrowserRouter>
  );
}

export default App;
