// @flow
import React from "react";
import clsx from "clsx";
import User from "entities/user";
import display from "config/display";
import useStyles from "./styles";

import PollingPanel from "./components/PollingPanel";
import TabItem from "components/TabItem";
import TabHeader from "components/TabHeader";
import TabContent from "components/TabContent";
import TabPanel from "components/TabPanel";
import Tab from "components/Tab";
import Chat from "components/Chat";
import ParticipantList from "components/ParticipantList";
import QuestionPanel from "components/QuestionPanel";

type Props = { user: User }

function MainTab({ user }:Props){
  const [ activeTab, setActiveTab ] = React.useState<string>("polling")
  const mStyles = useStyles();
  
  function handleParticipantsClick(){
    setActiveTab("participants");
  }
  
  function handleChatsClick(){
    setActiveTab("chats");
  }
  
  function handleQuestionsClick(){
    setActiveTab("questions");
  }

  function handlePollingClick(){
    setActiveTab("polling");
  }
  
  return (
    <Tab>
      <TabHeader>
        {display.participantTab && (
          <TabItem 
            onClick={handleParticipantsClick}
            isActive={activeTab === "participants"}
          >
            Participants
          </TabItem>
        )}
        {display.chatTab && (
           <TabItem 
            onClick={handleChatsClick}
            isActive={activeTab === "chats"}
          >
            Chats
          </TabItem>
        )}
        {display.questionTab && (
          <TabItem 
            onClick={handleQuestionsClick}
            isActive={activeTab === "questions"}
          >
            Questions
          </TabItem>
        )}
        {display.pollingTab && (
          <TabItem
            onClick={handlePollingClick}
            isActive={activeTab === "polling"}
          >
            Polling
          </TabItem>
        )}
      </TabHeader>
      <TabContent>
        {display.chatTab && (
          <TabPanel isActive={activeTab === "chats"}>
            <Chat me={user} />
          </TabPanel>
        )}
        {display.participantTab && (
          <TabPanel isActive={activeTab === "participants"}>
            <ParticipantList className={mStyles.participantList} />
          </TabPanel>
        )}
        {display.questionTab && (
          <TabPanel isActive={activeTab === "questions"}>
            <p className={clsx(mStyles.textHeader, "Vlt-center")}>
              You can put your question here. Anyone can vote to increase visibility as well.
            </p>
            <QuestionPanel />
          </TabPanel>
        )}
        {display.pollingTab && (
          <TabPanel isActive={activeTab === "polling"}>
            <PollingPanel />
          </TabPanel>
        )}
      </TabContent>
    </Tab>
  )
}
export default MainTab;
