// @flow
import React from "react";
import ConfigurationService from "services/configuration"
import type { Role } from "entities/user";

interface IArguments {
  role: Role;
  tenant: string;
}

function useLoginType({ role, tenant }: IArguments){
  const [ loginType, setLoginType ] = React.useState<string>("");

  React.useEffect(() => {
    async function fetch(){
      const configuration = await ConfigurationService.retrieve({ tenant });
      if (role === "participant") setLoginType(configuration.participant.loginType);
      else if (role === "moderator") setLoginType(configuration.moderator.loginType);
      else if (role === "presenter") setLoginType(configuration.presenter.loginType);
      else if (role === "ghostrider") setLoginType("bypass");
      else throw new Error(`Invalid role. Found ${role}`);
    }
    fetch();
  }, [ role, tenant ])

  return { loginType }
}
export default useLoginType;