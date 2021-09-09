import { MenuContext } from "../contexts/menu";
import { useContext } from "react";

export function useMenu () {
  return useContext(MenuContext);
}
