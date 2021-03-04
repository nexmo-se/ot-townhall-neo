// @flow
import React from "react";
import clsx from "clsx";
import User from "entities/user";

import useStyles from "./styles";
import useDisplay from "hooks/display";
import useMessage from "hooks/message";
import useSession from "hooks/session";
import { useParams } from "react-router-dom";

import PollingPanel from "./components/PollingPanel";
import RemoteSlidesPanel from "./components/RemoteSlidesPanel";
import TabItem from "components/TabItem";
import TabHeader from "components/TabHeader";
import TabContent from "components/TabContent";
import TabPanel from "components/TabPanel";
import Tab from "components/Tab";
import Chat from "components/Chat";
import ParticipantList from "components/ParticipantList";
import QuestionPanel from "components/QuestionPanel";

interface MainTabProps {
  user: User;
}

interface URLParameters {
  tenant: string;
}

function MainTab ({ user }: MainTabProps) {
  const [activeTab, setActiveTab] = React.useState<string>("chats");
  
  // TODO: this is for future development. We will only show `remote-slides` when it has `remote-slides`
  // as for now, just display it right away
  const [ localShows ] = React.useState<string[]>([
    "remote-slides"
  ]);

  const { session } = useSession();
  const { tenant } = useParams<URLParameters>();
  const { display } = useDisplay({ tenant });
  const { intendedForMe } = useMessage();
  const mStyles = useStyles();
  const lastTabRef = React.useRef();
  
  function handleParticipantsClick () {
    setActiveTab("participants");
  }
  
  function handleChatsClick () {
    setActiveTab("chats");
  }
  
  function handleQuestionsClick () {
    setActiveTab("questions");
  }

  function handlePollingClick () {
    setActiveTab("polling");
  }

  const startPollingListener = React.useCallback(
    () => {
      setActiveTab((prev) => {
        lastTabRef.current = prev;
        return "polling";
      })
    },
    []
  )

  const stopPollingListener = React.useCallback(
    () => {
      if (lastTabRef.current) setActiveTab(lastTabRef.current);
      lastTabRef.current = undefined;
    },
    []
  )

  const slidesAccessListener = React.useCallback(
    ({ data }) => {
      const jsonData = JSON.parse(data);
      if (intendedForMe({ data: JSON.stringify(jsonData.target) })) {
        setActiveTab("remote-slides");
      }
    },
    [intendedForMe]
  );

  React.useEffect(() => {
    if(session) session.on("signal:start-polling", startPollingListener)
    if(session) session.on("signal:stop-polling", stopPollingListener);
    if(session) session.on("signal:slides-access", slidesAccessListener);

    return function cleanup(){
      if(session) session.off("signal:start-polling", startPollingListener)
      if(session) session.off("signal:stop-polling", stopPollingListener);
      if(session) session.off("signal:slides-access", slidesAccessListener)
    }
  }, [
    session,
    startPollingListener,
    stopPollingListener,
    slidesAccessListener
  ])
  
  return (
    <Tab>
      <TabHeader>
        {display.participants && (
          <TabItem 
            onClick={handleParticipantsClick}
            isActive={activeTab === "participants"}
          >
            Participants
          </TabItem>
        )}
        {display.chat && (
           <TabItem 
            onClick={handleChatsClick}
            isActive={activeTab === "chats"}
          >
            Chats
          </TabItem>
        )}
        {display.questions && (
          <TabItem 
            onClick={handleQuestionsClick}
            isActive={activeTab === "questions"}
          >
            Questions
          </TabItem>
        )}
        {display.polling && (
          <TabItem
            onClick={handlePollingClick}
            isActive={activeTab === "polling"}
          >
            Polling
          </TabItem>
        )}
        { localShows.includes("remote-slides") && (
          <TabItem
            onClick={() => setActiveTab("remote-slides")}
            isActive={activeTab === "remote-slides"}
          >
            Remote Slides
          </TabItem>
        )}
      </TabHeader>
      <TabContent>
        {display.chat && (
          <TabPanel isActive={activeTab === "chats"}>
            <Chat me={user} />
          </TabPanel>
        )}
        {display.participants && (
          <TabPanel isActive={activeTab === "participants"}>
            <ParticipantList className={mStyles.participantList} />
          </TabPanel>
        )}
        {display.questions && (
          <TabPanel isActive={activeTab === "questions"}>
            <p className={clsx(mStyles.textHeader, "Vlt-center")}>
              You can put your question here. Anyone can vote to increase visibility as well.
            </p>
            <QuestionPanel />
          </TabPanel>
        )}
        {display.polling && (
          <TabPanel isActive={activeTab === "polling"}>
            <PollingPanel />
          </TabPanel>
        )}
        { localShows.includes("remote-slides") && (
          <TabPanel isActive={activeTab === "remote-slides"}>
            <RemoteSlidesPanel />
          </TabPanel>
        )}
      </TabContent>
    </Tab>
  )
}
export default MainTab;
