// @flow
import React from "react";
import { MeContext } from "contexts/me";

export default function useMe(){
  return React.useContext(MeContext);
}