// @flow
import React from "react";
import User from "entities/user";

import useStyles from "./styles";
import useDisplay from "./hooks/display";
import useMe from "hooks/me";
import { useParams } from "react-router-dom";

import ModeratorPolling from "../ModeratorPolling";
import QuestionPanel from "../QuestionPanel";
import SettingsPanel from "../SettingsPanel";
import RecordingPanel from "../RecordingPanel";
import Tab from "components/Tab";
import TabHeader from "components/TabHeader";
import TabItem from "components/TabItem";
import TabContent from "components/TabContent";
import TabPanel from "components/TabPanel";
import Chat from "components/Chat";

interface IParams {
  tenant: string;
}

function ModeratorMessageTab(){
  const [ activeTab, setActiveTab ] = React.useState<string>("settings");
  const { me } = useMe();
  const { tenant } = useParams<IParams>();
  const { display } = useDisplay({ tenant });
  const mStyles = useStyles();
  
  if(!me) return null;
  return (
    <Tab className={mStyles.root}>
      <TabHeader>
        {display.chat && (
          <TabItem 
            isActive={activeTab === "chats"}
            onClick={() => setActiveTab("chats")}
          >
            Chats
          </TabItem>
        )}
        {display.questions && (
          <TabItem 
            isActive={activeTab === "questions"}
            onClick={() => setActiveTab("questions")}
          >
            Questions
          </TabItem>
        )}
        {display.polling && (
          <TabItem
            isActive={activeTab === "polling"}
            onClick={() => setActiveTab("polling")}
          >
            Polling
          </TabItem>
        )}
        <TabItem
          isActive={activeTab === "settings"}
          onClick={() => setActiveTab("settings")}
        >
          Settings
        </TabItem>
        <TabItem
          isActive={activeTab === "recording"}
          onClick={() => setActiveTab("recording")}
        >
          Recording
        </TabItem>
      </TabHeader>
      <TabContent>
        {display.chat && (
          <TabPanel isActive={activeTab === "chats"}>
            <Chat me={me ?? new User({ name: "System", role: "system" })} autoScroll={false} />
          </TabPanel>
        )}
        {display.questions && (
          <TabPanel isActive={activeTab === "questions"}>
            <QuestionPanel />
          </TabPanel>
        )}
        {display.polling && (
          <TabPanel isActive={activeTab === "polling"}>
            <ModeratorPolling refresh={activeTab === "polling"} />
          </TabPanel>
        )}
        <TabPanel isActive={activeTab === "settings"}>
          <SettingsPanel />
        </TabPanel>
        <TabPanel isActive={activeTab === "recording"}>
          <RecordingPanel />
        </TabPanel>
      </TabContent>
    </Tab>
  )
}
export default ModeratorMessageTab;