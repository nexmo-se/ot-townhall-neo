// @flow
import React from "react";
import clsx from "clsx";
import type { Node } from "react";
import useStyles from "./styles";

type Props = { 
  children: Node, 
  isActive: boolean
};

function Tab({ children, isActive }:Props){
  const mStyles = useStyles();
  
  return (
    <div 
      className={clsx({
        "Vlt-tabs__panel": true,
        "Vlt-tabs__panel_active": isActive,
        [mStyles.panel]: isActive
      })}
    >
      {children}
    </div>
  )
}
export default Tab;