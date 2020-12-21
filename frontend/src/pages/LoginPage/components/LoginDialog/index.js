// @flow
import React from "react";
import lodash from "lodash";

import useLoginType from "../../hooks/login-type";
import { useParams } from "react-router-dom";

import User from "entities/user";
import type { Role } from "entities/user";

import AskNameDialog from "../AskNameDialog";
import AMADialog from "../AMADialog";
import SSODialog from "../SSODialog";
import FullPageLoading from "components/FullPageLoading";

interface ILoginDialog {
  role: Role,
  disabled?: boolean,
  onLoggedIn: (user: User) => Promise<void>
}

interface IParams {
  tenant: string;
}

function LoginDialog({ role, onLoggedIn, disabled = false }: ILoginDialog){
  const { tenant } = useParams<IParams>();
  const { loginType } = useLoginType({ role, tenant });

  if (lodash.isEmpty(loginType)) {
    return <FullPageLoading />
  } if (loginType === "default") {
    return (
      <AskNameDialog 
        disabled={disabled} 
        role={role}
        onLoggedIn={onLoggedIn}
      />
    )
  } else if (loginType === "ama") {
    return (
      <AMADialog 
        disabled={disabled}
        role={role}
        onLoggedIn={onLoggedIn}
      />
    )
  } else if (loginType === "sso"){
    return (
      <SSODialog 
        role={role}
        onLoggedIn={onLoggedIn}
      />
    )
  } else return null;
}
export default LoginDialog;