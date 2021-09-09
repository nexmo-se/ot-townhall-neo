// @flow

import React from "react";
import ConfigurationService from "services/configuration";
import { useSettings } from "../../hooks/settings";
import { SettingsContext } from "../../contexts/settings";

interface ISettingsProvider {
  children: any;
  tenant: string;
}

function SettingsProvider({ children, tenant }: ISettingsProvider) {
  const [presenterPin, setPresenterPin] = React.useState<string>("");
  const [participantPin, setParticipantPin] = React.useState<string>("");
  const [moderatorPin, setModeratorPin] = React.useState<string>("");
  const [presenterLoginType, setPresenterLoginType] = React.useState<string>("default");
  const [participantLoginType, setParticipantLoginType] = React.useState<string>("default");
  const [moderatorLoginType, setModeratorLoginType] = React.useState<string>("default");
  const [participantsTab, setParticipantsTab] = React.useState<boolean>(false);
  const [chatTab, setChatTab] = React.useState<boolean>(false);
  const [questionsTab, setQuestionsTab] = React.useState<boolean>(false);
  const [pollingTab, setPollingTab] = React.useState<boolean>(false);
  const [allowRaiseHand, setAllowRaiseHand] = React.useState<boolean>(false);

  async function saveSettings() {
    const payload = {
      participant: {
        pin: participantPin? participantPin: undefined,
        login_type: participantLoginType,
        raise_hand: allowRaiseHand
      },
      presenter:
      {
        pin: presenterPin? presenterPin: undefined,
        login_type: presenterLoginType
      },
      moderator:{
        pin: moderatorPin? moderatorPin: undefined,
        login_type: moderatorLoginType
      },
      tabs: {
        questions: questionsTab,
        participants: participantsTab,
        chat: chatTab,
        polling: pollingTab
      }
    }
    const cleanPayload = JSON.parse(JSON.stringify(payload));
    await ConfigurationService.update({ tenant, data: cleanPayload });

    setParticipantPin("");
    setPresenterPin("");
    setModeratorPin("");
    fetchConfiguration();
  }

  const fetchConfiguration = React.useCallback(
    async () => {
      const configuration = await ConfigurationService.retrieve({ tenant });
      
      setParticipantsTab(configuration.tabs.participants);
      setChatTab(configuration.tabs.chat);
      setQuestionsTab(configuration.tabs.questions);
      setPollingTab(configuration.tabs.polling);

      setParticipantLoginType(configuration.participant.loginType);
      setPresenterLoginType(configuration.presenter.loginType);
      setModeratorLoginType(configuration.moderator.loginType);

      setAllowRaiseHand(configuration.participant.raiseHand ?? true);
    },
    [tenant]
  )

  return (
    <SettingsContext.Provider
      value={{
        participantPin,
        presenterPin,
        moderatorPin,
        participantsTab,
        chatTab,
        questionsTab,
        pollingTab,
        participantLoginType,
        presenterLoginType,
        moderatorLoginType,
        allowRaiseHand,
        setAllowRaiseHand,
        setParticipantLoginType,
        setPresenterLoginType,
        setModeratorLoginType,
        setParticipantsTab,
        setChatTab,
        setQuestionsTab,
        setPollingTab,
        setParticipantPin,
        setModeratorPin,
        setPresenterPin,
        saveSettings,
        fetchConfiguration
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export { useSettings };
export default SettingsProvider;
