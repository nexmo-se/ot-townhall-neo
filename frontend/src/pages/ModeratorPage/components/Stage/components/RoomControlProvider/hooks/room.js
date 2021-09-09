import { RoomControlContext } from "../contexts/room";
import { useContext } from "react";

export function useRoom () {
  return useContext(RoomControlContext);
}
