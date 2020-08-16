// @flow
import React from "react";
import type { Node } from "react";
import clsx from "clsx";
import useStyles from "./styles";

type Props = { children: Node };

function Tab({ children }:Props){
  const mStyles = useStyles();
  
  return (
    <div className={clsx("Vlt-tabs", mStyles.tabs)}>
      {children}
    </div>
  )
}
export default Tab;