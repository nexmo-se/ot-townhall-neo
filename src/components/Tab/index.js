// @flow
import React from "react";
import type { Node } from "react";
import clsx from "clsx";
import useStyles from "./styles";

type Props = { 
  children: Node,
  className?: any
};

function Tab({ children, className }:Props){
  const mStyles = useStyles();
  
  return (
    <div className={clsx("Vlt-tabs", mStyles.tabs, className)}>
      {children}
    </div>
  )
}
export default Tab;