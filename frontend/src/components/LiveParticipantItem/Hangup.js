// @flow
import React from "react";
import User from "entities/user";
import useSession from "hooks/session";
import { Subscriber } from "@opentok/client";

import HangupButton from "components/HangupButton";

type Props = { subscriber?: Subscriber }

function Hangup({ subscriber }:Props){
  const mSession = useSession();
  
  function handleClick(){
    if(subscriber){
      const { connection } = subscriber.stream;
      const data = JSON.parse(connection.data);
      const user = User.fromJSON(data);
      user.id = connection.id;
      
      mSession.session.signal({
        type: "force-unpublish",
        data: JSON.stringify(user.toJSON())
      });
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