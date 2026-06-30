import React from "react";

import useStyles from "./styles";
import { useSettings } from "../SettingsProvider";

import Checkbox from "components/Checkbox";

function TabsSettings() {
  const {
    participantsTab,
    questionsTab,
    chatTab,
    pollingTab,
    setParticipantsTab,
    setQuestionsTab,
    setChatTab,
    setPollingTab
  } = useSettings();
  const mStyles = useStyles(); 

  return (
    <>
      <p>
        <strong>Tabs.</strong> &nbsp;
        You can setup Tabs here. This will effect all roles
      </p>

      <div className={mStyles.tabs}>
        <div>
          <Checkbox 
            value="participants"
            label="Participants List"
            checked={participantsTab}
            onChange={setParticipantsTab}
          />
          <Checkbox 
            value="chats"
            label="Chats"
            checked={chatTab}
            onChange={setChatTab} 
          />
        </div>
        <div>
          <Checkbox 
            value="questions"
            label="Questions"
            checked={questionsTab}
            onChange={setQuestionsTab}
          />
          <Checkbox 
            value="polling"
            label="Polling"
            checked={pollingTab} 
            onChange={setPollingTab}
          />
        </div>
      </div>
    </>
  )
}

export default TabsSettings;
