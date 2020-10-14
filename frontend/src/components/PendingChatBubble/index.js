// @flow
import React from "react";
import useStyles from "./styles";
import User from "entities/user";

import Avatar from "components/Avatar";

type PendingChatBubbleProps = {
  name: string,
  message: string
}
function PendingChatBubble({ name, message }:PendingChatBubbleProps){
  const [ user ] = React.useState<User>(new User(name, "unknown"));
  const mStyles = useStyles();

  return (
    <div className="Vlt-card Vlt-card--plain Vlt-bg-red-lighter Vlt-card--lesspadding" style={{ marginTop: 8, marginBottom: 4 }}>
      <div className="Vlt-card__content" style={{ display: "flex", flexDirection: "row" }}>
        <Avatar user={user} size={50} className={mStyles.avatar} />
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 200  }}>
          <p><b>{name}</b></p>
          <p style={{ wordBreak: "break-word", whiteSpace: "normal" }}>{message}</p>
        </div>
      </div>
    </div>
  );
}
export default PendingChatBubble;