import { createContext } from "react";

import Configuration from "../models/configuration";
import Tabs from "../models/tabs";
import Login from "../models/login";
import ParticipantLogin from "../models/participant-login";
import State from "../models/state";

export const DEFAULT_CONFIGURATION = new Configuration({
  tabs: new Tabs({
    questions: false,
    participants: false,
    polling: false,
    chat: false
  }),
  participant: new ParticipantLogin({
    loginType: "default",
    raiseHand: true
  }),
  moderator: new Login({ loginType: "default" }),
  presenter: new Login({ loginType: "default" }),
  state: new State({ status: "locked" })
});

export const ConfigurationContext = createContext({
  configuration: DEFAULT_CONFIGURATION
});
