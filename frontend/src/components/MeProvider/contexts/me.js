import { createContext } from "react";

export const MeContext = createContext({
  me: undefined,
  loggedIn: false,
  login: () => false
});
