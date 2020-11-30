// @flow
import React from "react";
import User from "entities/user";
import useStyles from "./styles";

import ModeratorStream from "components/ModeratorStream";
import MainTab from "components/MainTab";

type Props = { user: User }

function RightPanel({ user }:Props){
  const mStyles = useStyles();
  
  return (
    <div className={mStyles.root}>
      <ModeratorStream />
      <MainTab user={user} />
    </div>
  )
}
export default RightPanel;