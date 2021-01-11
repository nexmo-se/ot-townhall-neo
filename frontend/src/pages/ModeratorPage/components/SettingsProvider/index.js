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
  const [participantsTab, setParticipantsTab] = React.useState<boolean>(false);
  const [chatTab, setChatTab] = React.useState<boolean>(false);
  const [questionsTab, setQuestionsTab] = React.useState<boolean>(false);
  const [pollingTab, setPollingTab] = React.useState<boolean>(false);

  async function saveSettings() {
    const payload = {
      participant: participantPin? { pin: participantPin }: undefined,
      presenter: presenterPin? { pin: presenterPin }: undefined,
      moderator: moderatorPin? { pin: moderatorPin }: undefined,
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
  }

  React.useEffect(() => {
    async function fetch(){
      const configuration = await ConfigurationService.retrieve({ tenant });
      setParticipantsTab(configuration.tabs.participants);
      setChatTab(configuration.tabs.chat);
      setQuestionsTab(configuration.tabs.questions);
      setPollingTab(configuration.tabs.polling);
    }
    fetch();
  }, [tenant]);

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
        setParticipantsTab,
        setChatTab,
        setQuestionsTab,
        setPollingTab,
        setParticipantPin,
        setModeratorPin,
        setPresenterPin,
        saveSettings
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export { useSettings };
export default SettingsProvider;
