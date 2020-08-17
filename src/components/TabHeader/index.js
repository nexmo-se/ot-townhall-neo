// @flow
import React from "react";
import type { Node } from "react";

type Props = { children: Node };

function Tab({ children }:Props){
  return (
    <div className="Vlt-tabs__header">
      {children}
    </div>
  )
}
export default Tab;