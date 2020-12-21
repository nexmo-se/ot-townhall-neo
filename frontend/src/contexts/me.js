// @flow
import React from "react";
import User from "entities/user";
import type { Node } from "react";

interface IMeProvider { children: Node }
interface IMeContext {
  me: User | void;
  loggedIn: boolean;
  login: (user: User) => boolean;
};

export const MeContext = React.createContext<IMeContext>({
  me: undefined,
  loggedIn: false,
  login: (user: User) => false,
})

export default function MeProvider({ children }: IMeProvider) {
  const [ me, setMe ] = React.useState<User | void>();
  const [ loggedIn, setLoggedIn ] = React.useState<boolean>(false);

  const login = React.useCallback((user: User) => {
    setMe(user);
    setLoggedIn(true);
    return true;
  }, []);
  
  return (
    <MeContext.Provider value={{ loggedIn, me, login }}>
      {children}
    </MeContext.Provider>
  )
}