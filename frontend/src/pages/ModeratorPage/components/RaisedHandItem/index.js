// @flow
import React from "react";
import User from "entities/user";

import useStyles from "./styles";
import useMessage from "hooks/message";

import Avatar from "components/Avatar";

type Props = { user:User }

function RaisedHandItem({ user }:Props){
  const mMessage = useMessage();
  const mStyles = useStyles();

  async function handleGoLiveClick(){
    await mMessage.forcePublish({ user });
    mMessage.removeRaisedHand(user);
  }

  return (
    <div className="Vlt-card Vlt-card--plain Vlt-bg-aqua-lighter Vlt-card--lesspadding" style={{ marginTop: 8, marginBottom: 4 }}>
      <div className="Vlt-card__content" style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        <Avatar user={user} size={50} className={mStyles.avatar} />
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 200  }}>
          <p><b>{user.name}</b></p>    
          <button className="Vlt-btn" style={{ margin: 0 }} onClick={handleGoLiveClick}>
            Go Live
          </button>
        </div>
      </div>
    </div>
  );
}
export default RaisedHandItem;