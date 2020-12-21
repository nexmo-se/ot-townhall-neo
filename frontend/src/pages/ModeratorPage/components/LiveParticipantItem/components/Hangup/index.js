// @flow
import React from "react";
import User from "entities/user";
import useMessage from "hooks/message";
import { Subscriber } from "@opentok/client";

import HangupButton from "components/HangupButton";

interface IHangup { subscriber?: Subscriber }
function Hangup({ subscriber }: IHangup){
  const mMessage = useMessage();
  
  function handleClick(){
    if(subscriber){
      const { connection } = subscriber.stream;
      const user = User.fromConnection(connection);
      mMessage.forceUnpublish({ user });
    }
  }
  
  if(!subscriber) return null;
  else return (
    <HangupButton 
      size={32}
      fontSize={16}
      onClick={handleClick}
    />
  )
}
export default Hangup;