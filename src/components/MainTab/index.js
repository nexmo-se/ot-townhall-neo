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

type Props = { user: User }

function MainTab({ user }:Props){
  const [ activeTab, setActiveTab ] = React.useState<string>("chats")
  const mStyles = useStyles();
  
  return (
    <Tab>
      <TabHeader>
        <TabItem isActive={activeTab === "participants"}>
          Participants
        </TabItem>
        <TabItem isActive={activeTab === "chats"}>
          Chats
        </TabItem>
        <TabItem isActive={activeTab === "questions"}>
          Questions
        </TabItem>
      </TabHeader>
      <TabContent>
        <TabPanel isActive={activeTab === "chats"}>
          <Chat user={user} />
        </TabPanel>
      </TabContent>
    </Tab>
  )
}
export default MainTab;
