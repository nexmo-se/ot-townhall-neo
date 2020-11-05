// @flow
import React from 'react';

import MeProvider from "contexts/me";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import PresenterPage from "pages/PresenterPage";
import ParticipantPage from "pages/ParticipantPage";
import ModeratorPage from "pages/ModeratorPage";
import GhostRiderPage from "pages/GhostRiderPage";
import LoginPage from "pages/LoginPage";

function App() {
  return (
    <ThemeProvider theme={createMuiTheme()}>
      <BrowserRouter>
        <MeProvider>
          <Switch>
            <Route exact path="/:tenant/presenter" component={PresenterPage} />
            <Route exact path="/:tenant/participant" component={ParticipantPage} />
            <Route exact path="/:tenant/moderator" component={ModeratorPage} />
            <Route exact path="/:tenant/ghostrider" component={GhostRiderPage} />
            <Route exact path="/:tenant/:role/login" component={LoginPage} />
          </Switch>
        </MeProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
