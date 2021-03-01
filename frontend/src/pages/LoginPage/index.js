// @flow
import React from "react";
import User from "entities/user";

import useMe from "hooks/me";
import { useParams, useHistory } from "react-router-dom";

import LoginDialog from "./components/LoginDialog";

interface IParam { role: string, tenant: string }
function LoginPage(){
  const [ loading, setLoading ] = React.useState<boolean>(false);
  const { tenant, role } = useParams<IParam>();
  const { login } = useMe();
  const { push } = useHistory();

  const handleLoggedIn = React.useCallback(async (user: User): Promise<void> => {
    setLoading(true);
    login(user);
    push(`/${tenant}/${role}`);
  }, [ login, push, role, tenant ]);

  /**
   * By pass login here
   */
   React.useEffect(() => {
      // if(role === "moderator") handleLoggedIn(new User({ name: "Moderator", role: "moderator" }));
      // if(role === "presenter") handleLoggedIn(new User({ name: "Presenter", role: "presenter" }));
      // if(role === "participant") handleLoggedIn(new User({ name: "Participant", role: "participant" }));
      if(role === "ghostrider") handleLoggedIn(new User({ name: "Ghost Rider", role: "participant" }));
   }, [ role, handleLoggedIn ])
  
  return (
    <>
      <LoginDialog 
        role={role}
        onLoggedIn={handleLoggedIn}
        disabled={loading}
      />
    </>
  )
}
export default LoginPage;