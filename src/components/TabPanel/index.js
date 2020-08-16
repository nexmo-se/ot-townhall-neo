// @flow
import React from "react";
import clsx from "clsx";
import type { Node } from "react";
import useStyles from "./styles";

type Props = { children: Node };

function Tab({ children }:Props){
  const mStyles = useStyles();
  
  return (
    <div 
      className={clsx({
        "Vlt-tabs__content": true,
        "Vlt-tabs__panel_active": true,
        [mStyles.panel]: true
      })}
    >
      {children}
    </div>
  )
}
export default Tab;