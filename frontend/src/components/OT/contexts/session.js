import { createContext } from "react";

export const SessionContext = createContext({
  isConnected: false,
  connections: [],
  streams: []
});