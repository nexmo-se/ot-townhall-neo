// @flow
import React from "react";

import Message from "entities/message";
import User from "entities/user";

import useSession from "hooks/session";
import useMessage from "hooks/message";

function RaiseHandButton(){
  const { session } = useSession();
  const { raiseHand, send } = useMessage();

  function handleClick(){
    const user = User.fromConnection(session.connection);
    raiseHand({ user });
    
    const message = new Message(user, `${user.name} is raising hand`);
    send({ message });
  }

  return (
    <button 
      className="Vlt-btn Vlt-bg-aqua Vlt-white" 
      onClick={handleClick}
    >
      Raise Hand
    </button>
  )
}

RaiseHandButton.defaultProps = { size: 50, fontSize: 24 }
export default RaiseHandButton;