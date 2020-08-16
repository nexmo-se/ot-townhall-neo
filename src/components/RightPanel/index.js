// @flow
import React from "react";
import clsx from "clsx";
import useStyles from "./styles";

import ModeratorStream from "components/ModeratorStream";
import Chat from "components/Chat";

type Props = { user: User }

function RightPanel({ user }:Props){
  const mStyles = useStyles();
  
  return (
    <div className={mStyles.root}>
      <div className={mStyles.moderator}>
        <ModeratorStream />
      </div>
      <div className={clsx("Vlt-tabs", mStyles.tabs)}>
        <div className="Vlt-tabs__header">
          <li className="Vlt-tabs__link">Participants</li>
          <li className="Vlt-tabs__link Vlt-tabs__link_active">Chats</li>
          <li className="Vlt-tabs__link">Questions</li>
        </div>
        <div className={clsx("Vlt-tabs__content", mStyles.contentContainer)}>
          <div 
            className={clsx(
              "Vlt-tabs__content",
              "Vlt-tabs__panel_active",
              mStyles.tabContent
            )}
          >
            <Chat user={user} />
          </div>
        </div>
      </div>
      <div className={mStyles.otherFunctions}>
        
      </div>
    </div>
  )
}
export default RightPanel;