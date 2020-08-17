// @flow
import React from "react";
import User from "entities/user";
import useStyles from "./styles";

import ChatList from "components/ChatList";
import ChatInput from "components/ChatInput";

type Props = { me: User };

function Chat({ me }:Props){
  const mStyles = useStyles();
  
  return (
    <React.Fragment>
      <ChatList />
      <ChatInput user={me} byPass />
    </React.Fragment>
  )
}
export default Chat;