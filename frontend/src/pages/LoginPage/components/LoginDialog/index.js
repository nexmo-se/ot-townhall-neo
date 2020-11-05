// @flow
import React from "react";
import participant from "config/participant";
import moderator from "config/moderator";
import presenter from "config/presenter";
import global from "config";

import User from "entities/user";
import type { Role } from "entities/user";

import AskNameDialog from "../AskNameDialog";
import AMADialog from "../AMADialog";

interface ILoginDialog {
  role: Role,
  disabled?: boolean,
  onLoggedIn: (user: User) => Promise<void>
}

function LoginDialog({ role, onLoggedIn, disabled = false }: ILoginDialog){
  const [ pin, setPin ] = React.useState<string>("complicatedPIN");

  React.useEffect(() => {
    if(role === "participant") setPin(participant.pin);
    else if(role === "moderator") setPin(moderator.pin);
    else if(role === "presenter") setPin(presenter.pin);
  }, [ role ])

  if(participant.loginStyle === "default" || global.loginStyle === "default"){
    return (
      <AskNameDialog 
        disabled={disabled}
        pin={pin}
        role={role}
        onLoggedIn={onLoggedIn}
      />
    )
  }else if(role === "participant" && participant.loginStyle === "ama"){
    return (
      <AMADialog 
        disabled={disabled} 
        role={role} 
        onLoggedIn={onLoggedIn} 
      />
    )
  }else return null;
}
export default LoginDialog;