// @flow
import React, { useEffect } from "react";
import User from "entities/user";

import useMe from "hooks/me";
import { useParams, useHistory } from "react-router-dom";

import LoginDialog from "./components/LoginDialog";

interface IParam { role: string, tenant: string }
function LoginPage(){
  const [ loading, setLoading ] = React.useState<boolean>(false);
  const { tenant, role } = useParams<IParam>();
  const { login, loggedIn } = useMe();
  const history = useHistory();

  const handleLoggedIn = React.useCallback(async (user: User): Promise<void> => {
    setLoading(true);
    login(user);
    history.push(`/${tenant}/${role}`);
  }, [ login, history.push, role, tenant ]);

  useEffect(() => {
    // Window back button clicked
    if (history.action === "POP" && loggedIn) {
      history.push(`/thank-you`);
      window.location.reload();
    }
  }, [history.action, loggedIn])

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
