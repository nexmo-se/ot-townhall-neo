import { MeContext } from "../contexts/me";
import { useContext } from "react";

export function useMe () {
  return useContext(MeContext);
}
