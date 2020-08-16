// @flow
import React from "react";
import Avatar from 'react-avatar';
import User from "entities/user";
import InviteLiveButton from "./InviteLiveButton";

type Props = { user: User };

function ParticipantItem({ user }:Props){
  return (
    <div className="Vlt-card Vlt-card--plain Vlt-bg-aqua-lighter Vlt-card--lesspadding" style={{ marginTop: 8, marginBottom: 4 }}>
      <div className="Vlt-card__content" style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        <Avatar src={`https://api.adorable.io/avatars/285/${user.name}.png`} round={true} size={50} style={{ marginRight: 16 }}/>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 200  }}>
          <p><b>{user.name}</b></p>    
          <InviteLiveButton user={user} />
        </div>
      </div>
    </div>
  );
}
export default ParticipantItem;