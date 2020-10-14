// @flow
import React from "react";
import participant from "config/participant";
import User from "entities/user";

import AskNameDialog from "./AskNameDialog";
import AMADialog from "./AMADialog";

type LoginDialogProps = {
  role: string,
  onLoggedIn: (user: User) => void
}

function LoginDialog({ role, onLoggedIn }: LoginDialogProps){
  if(role === "participant" && participant.loginStyle === "default"){
    return (
      <AskNameDialog 
        pin={participant.pin}
        role={role}
        onSubmit={onLoggedIn}
      />
    )
  }else if(role === "participant" && participant.loginStyle === "ama"){
    return <AMADialog role={role} onSubmit={onLoggedIn} />
  }else return null;
}
export default LoginDialog;