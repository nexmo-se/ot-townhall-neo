// @flow
import React from "react";
import clsx from "clsx";
import type { Node } from "react";
import useStyles from "./styles";

type Props = { children: Node };

function Tab({ children }:Props){
  const mStyles = useStyles();
  
  return (
    <div className={clsx("Vlt-tabs__content", mStyles.root)}>
      {children}
    </div>
  )
}
export default Tab;