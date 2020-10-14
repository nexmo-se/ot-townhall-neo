// @flow
import React from "react";
import MessageAPI from "api/message";

import useStyles from "./styles";
import useSession from "hooks/session";

import User from "entities/user";
import Message from "entities/message";

import TextInput from "components/TextInput";
import Button from "components/Button";

interface IChatInput{
  user: User,
  byPass?: boolean
}

function ChatInput({ user, byPass }: IChatInput){
  const [ text, setText ] = React.useState<string>("");
  const mSession = useSession();
  const mStyles = useStyles();

  function handleClick(e){
    if(e) e.preventDefault();
    const isApproved = (byPass)? true: false;
    const message = new Message(user, text, isApproved);
    MessageAPI.sendMessage(mSession.session, message);
    setText("");
  }

  return (
    <form style={mStyles.root} onSubmit={handleClick}>
      <TextInput 
        text={text} 
        onChange={setText} 
        style={mStyles.input}
      />
      <Button
        type="submit" 
        text="Send" 
        onClick={handleClick} 
        style={mStyles.button}
      />
    </form>
  )
}
export default ChatInput;