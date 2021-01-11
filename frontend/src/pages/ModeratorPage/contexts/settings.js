// @flow
import React from "react";

type SettingsContextType = {
  participantPin: string;
  presenterPin: string;
  moderatorPin: string;
  participantsTab: boolean;
  chatTab: boolean;
  questionsTab: boolean;
  pollingTab: boolean;
  participantLoginType: string;
  presenterLoginType: string;
  moderatorLoginType: string;
  setParticipantLoginType: Function;
  setPresenterLoginType: Function;
  setModeratorLoginType: Function;
  setParticipantsTab: Function;
  setChatTab: Function;
  setQuestionsTab: Function;
  setPollingTab: Function;
  setParticipantPin: Function;
  setPresenterPin: Function;
  setModeratorPin: Function;
  saveSettings: Function;
  fetchConfiguration: Function;
}

export const SettingsContext = React.createContext<SettingsContextType>({
  
});
