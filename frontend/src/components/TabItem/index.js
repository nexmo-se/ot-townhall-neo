// @flow
import React from "react";
import type { Node } from "react";
import clsx from "clsx";

type Props = {
  isActive: boolean,
  children: Node | string
}

function TabItem({ isActive, children, ...props }:Props){
  return (
    <li 
      {...props}
      className={clsx({
        "Vlt-tabs__link": true,
        "Vlt-tabs__link_active": isActive
      })}
    >
      {children}
    </li>
  )
}
export default TabItem;