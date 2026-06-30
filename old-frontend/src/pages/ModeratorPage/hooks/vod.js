// @flow
import React from "react";
import { VODContext } from "../contexts/vod";

export default function useVOD() {
  return React.useContext(VODContext);
}