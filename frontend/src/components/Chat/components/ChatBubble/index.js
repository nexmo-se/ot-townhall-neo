// @flow
import React from "react";
import clsx from "clsx";
import useStyles from "./styles";
import User from "entities/user";

import Avatar from "components/Avatar";

type ChatBubbleProps = { 
  name: string,
  message: string
}

function ChatBubble({ name, message }:ChatBubbleProps){
  const [ user ] = React.useState<User>(new User({ name, role: "unknown" }));
  const mStyles = useStyles();

  return (
    <div 
      className={clsx(
        "Vlt-card",
        "Vlt-card--plain",
        "Vlt-bg-orange-lighter",
        "Vlt-card--lespadding",
        mStyles.root
      )} 
    >
      <div className="Vlt-card__content" style={{ display: "flex", flexDirection: "row" }}>
        <Avatar user={user} size={50} className={mStyles.avatar} />
        <div className={mStyles.chat}>
          <p><b>{name}</b></p>
          <p className={mStyles.message}>{message}</p>
        </div>
      </div>
    </div>
  );
}
export default ChatBubble;