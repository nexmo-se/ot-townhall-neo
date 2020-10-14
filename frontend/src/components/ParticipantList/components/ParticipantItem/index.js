// @flow
import React from "react";
import clsx from "clsx";
import useStyles from "./styles";
import User from "entities/user";

import InviteLiveButton from "../InviteLiveButton";
import Avatar from "components/Avatar";

interface IParticipantItem { user: User };
function ParticipantItem({ user }: IParticipantItem){
  const mStyles = useStyles();

  return (
    <div 
      className={clsx(
        "Vlt-card",
        "Vlt-card--plain",
        "Vlt-bg-aqua-lighter",
        "Vlt-card--lesspadding",
        mStyles.root
      )}>
      <div className={clsx("Vlt-card__content", mStyles.content)}>
        <Avatar user={user} className={mStyles.avatar} size={50} />
        <div className={mStyles.nameContent}>
          <p><b>{user.name}</b></p>    
          <InviteLiveButton user={user} />
        </div>
      </div>
    </div>
  );
}
export default ParticipantItem;