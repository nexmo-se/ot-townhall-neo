// @flow
import React from "react";

type SettingsContextType = {
  participantPin: string;
  presenterPin: string;
  moderatorPin: string;
  setParticipantPin: Function;
  setPresenterPin: Function;
  setModeratorPin: Function;
  saveSettings: Function;
}

export const SettingsContext = React.createContext<SettingsContextType>({
  
});
