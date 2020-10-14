// @flow
import React from "react";
import User from "entities/user";
import useStyles from "./styles";

import ChatList from "components/ChatList";
import ChatInput from "components/ChatInput";

type Props = { me: User, autoScroll?: boolean };

function Chat({ me, autoScroll }:Props){
  const mStyles = useStyles();
  
  return (
    <React.Fragment>
      <ChatList autoScroll={autoScroll} />
      <ChatInput user={me} byPass />
    </React.Fragment>
  )
}
export default Chat;