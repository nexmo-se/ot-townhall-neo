import { ConfigurationContext } from "../contexts/configuration";
import { useContext } from "react";

export function useConfiguration () {
  return useContext(ConfigurationContext);
}
