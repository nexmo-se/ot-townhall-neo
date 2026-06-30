// @flow
import React from "react";
import User from "entities/user";
import Participant from "entities/participant";
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
  const [ customerDetails, setCustomerDetails ] = React.useState<Participant | void>();

  const login = React.useCallback((user: User, participant: Participant) => {
    setMe(user);
    if (participant) setCustomerDetails(participant);
    setLoggedIn(true);
    return true;
  }, []);


  
  return (
    <MeContext.Provider value={{ loggedIn, me, customerDetails, login }}>
      {children}
    </MeContext.Provider>
  )
}