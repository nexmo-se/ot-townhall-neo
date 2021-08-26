import { MeContext } from "./contexts/me";
import { useCallback, useState } from "react";

function MeProvider ({children}) {
  const [me, setMe] = useState();
  const [loggedIn, setLoggedIn] = useState(false);

  const login = useCallback(
    (user) => {
      setMe(user);
      setLoggedIn(true);
      return true;
    },
    []
  )

  return (
    <MeContext.Provider
      value={{
        loggedIn,
        me,
        login
      }}
    >
      {children}
    </MeContext.Provider>
  )
}

export { useMe } from "./hooks/me";
export default MeProvider;
