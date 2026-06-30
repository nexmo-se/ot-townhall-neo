// @flow
import React from "react";
import { PollingContext } from "contexts/polling";
export default function usePolling(){
  return React.useContext(PollingContext);
}