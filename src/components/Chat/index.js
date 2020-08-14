// @flow
import React from "react";
import useStyles from "./styles";

import ChatList from "components/ChatList";
import ChatInput from "components/ChatInput";

type Props = { user: User };

function Chat({ user }:Props){
  const mStyles = useStyles();
  
  return (
    <React.Fragment>
      <ChatList />
      <ChatInput user={user} byPass />
    </React.Fragment>
  )
}
export default Chat;