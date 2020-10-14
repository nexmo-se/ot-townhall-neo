// @flow
import React from "react";
import User from "entities/user";
import type { Node } from "react";

type ProviderProps = { children: Node }
type ContextProps = {
  me: User|void,
  setMe: (user:User) => void
};

const defaultValue = {
  me: undefined,
  setMe: (user:User) => {}
}

export const MeContext = React.createContext<ContextProps>(defaultValue)
export default function MeProvider({ children }:ProviderProps){
  const [ me, setMe ] = React.useState<User|void>();
  
  return (
    <MeContext.Provider value={{ me, setMe }}>
      {children}
    </MeContext.Provider>
  )
}