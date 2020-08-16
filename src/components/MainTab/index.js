// @flow
import React from "react";
import clsx from "clsx";
import User from "entities/user";
import useStyles from "./styles";

import TabItem from "components/TabItem";
import TabHeader from "components/TabHeader";
import TabContent from "components/TabContent";
import TabPanel from "components/TabPanel";
import Tab from "components/Tab";
import Chat from "components/Chat";
import ParticipantList from "components/ParticipantList";

type Props = { user: User }

function MainTab({ user }:Props){
  const [ activeTab, setActiveTab ] = React.useState<string>("participants")
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
  
  return (
    <Tab>
      <TabHeader>
        <TabItem 
          onClick={handleParticipantsClick}
          isActive={activeTab === "participants"}
        >
          Participants
        </TabItem>
        <TabItem 
          onClick={handleChatsClick}
          isActive={activeTab === "chats"}
        >
          Chats
        </TabItem>
        <TabItem 
          onClick={handleQuestionsClick}
          isActive={activeTab === "questions"}
        >
          Questions
        </TabItem>
      </TabHeader>
      <TabContent>
        <TabPanel isActive={activeTab === "chats"}>
          <Chat me={user} />
        </TabPanel>
        <TabPanel isActive={activeTab === "participants"}>
          <ParticipantList className={mStyles.participantList} />
        </TabPanel>
      </TabContent>
    </Tab>
  )
}
export default MainTab;
