import { PollingContext } from "../contexts/polling";
import { useContext } from "react";

export function usePolling () {
  return useContext(PollingContext);
}
