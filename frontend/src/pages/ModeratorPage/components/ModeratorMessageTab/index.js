// @flow
import React from "react";
import User from "entities/user";
import display from "config/display";

import useStyles from "./styles";
import useMe from "hooks/me";

import ModeratorPolling from "../ModeratorPolling";
import QuestionPanel from "../QuestionPanel";
import Tab from "components/Tab";
import TabHeader from "components/TabHeader";
import TabItem from "components/TabItem";
import TabContent from "components/TabContent";
import TabPanel from "components/TabPanel";
import Chat from "components/Chat";

function ModeratorMessageTab(){
  const [ activeTab, setActiveTab ] = React.useState<string>("questions");
  const { me } = useMe();
  const mStyles = useStyles();
  
  function handleChatClick(){
    setActiveTab("chats");
  }
  
  function handleQuestionClick(){
    setActiveTab("questions");
  }

  function handlePollingClick(){
    setActiveTab("polling");
  }
  
  if(!me) return null;
  return (
    <Tab className={mStyles.root}>
      <TabHeader>
        {display.chatTab && (
          <TabItem 
            isActive={activeTab === "chats"}
            onClick={handleChatClick}
          >
            Chats
          </TabItem>
        )}
        {display.questionTab && (
          <TabItem 
            isActive={activeTab === "questions"}
            onClick={handleQuestionClick}
          >
            Questions
          </TabItem>
        )}
        {display.pollingTab && (
          <TabItem
            isActive={activeTab === "polling"}
            onClick={handlePollingClick}
          >
            Polling
          </TabItem>
        )}
      </TabHeader>
      <TabContent>
        {display.chatTab && (
          <TabPanel isActive={activeTab === "chats"}>
            <Chat me={me ?? new User({ name: "System", role: "system" })} autoScroll={false} />
          </TabPanel>
        )}
        {display.questionTab && (
          <TabPanel isActive={activeTab === "questions"}>
            <QuestionPanel />
          </TabPanel>
        )}
        {display.pollingTab && (
          <TabPanel isActive={activeTab === "polling"}>
            <ModeratorPolling />
          </TabPanel>
        )}
      </TabContent>
    </Tab>
  )
}
export default ModeratorMessageTab;