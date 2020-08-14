// @flow
import React from "react";
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
      <div className={mStyles.otherFunctions}>
        <Chat user={user} />
      </div>
    </div>
  )
}
export default RightPanel;