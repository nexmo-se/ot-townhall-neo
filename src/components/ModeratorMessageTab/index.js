// @flow
import React from "react";

import useStyles from "./styles";
import useMe from "hooks/me";

import Tab from "components/Tab";
import TabHeader from "components/TabHeader";
import TabItem from "components/TabItem";
import TabContent from "components/TabContent";
import TabPanel from "components/TabPanel";
import Chat from "components/Chat";
import QuestionPanel from "components/QuestionPanel";

function ModeratorMessageTab(){
  const [ activeTab, setActiveTab ] = React.useState<string>("chats");
  const mStyles = useStyles();
  const mMe = useMe();
  
  function handleChatClick(){
    setActiveTab("chats");
  }
  
  function handleQuestionClick(){
    setActiveTab("questions");
  }
  
  if(!mMe.me) return null;
  return (
    <Tab className={mStyles.root}>
      <TabHeader>
        <TabItem 
          isActive={activeTab === "chats"}
          onClick={handleChatClick}
        >
          Chats
        </TabItem>
        <TabItem 
          isActive={activeTab === "questions"}
          onClick={handleQuestionClick}
        >
          Questions
        </TabItem>
      </TabHeader>
      <TabContent>
        <TabPanel isActive={activeTab === "chats"}>
          <Chat me={mMe.me} />
        </TabPanel>
        <TabPanel isActive={activeTab === "questions"}>
          <QuestionPanel />
        </TabPanel>
      </TabContent>
    </Tab>
  )
}
export default ModeratorMessageTab;