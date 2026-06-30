// @flow
import React from "react";
import User from "entities/user";

import ChatList from "./components/ChatList";
import ChatInput from "./components/ChatInput";

interface IChat { 
  me?: User;
  autoScroll?: boolean;
  withInput?: boolean;
};

function Chat({ me, autoScroll, withInput = true }: IChat){
  return (
    <React.Fragment>
      <ChatList autoScroll={autoScroll} />
      {(withInput && me) && (
        <ChatInput user={me} byPass />
      )}
    </React.Fragment>
  )
}
export default Chat;