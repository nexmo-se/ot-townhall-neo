// @flow

import React from "react";
import { useEffect } from "react";

interface TooltipProps {
  children: any;
  title: string;
}

function Tooltip ({ children, title }: TooltipProps) {
  useEffect(
    () => {
      window.Volta.init(["tooltip"]);
    },
    []
  );

  return (
    <div className="Vlt-tooltip Vlt-tooltip--top" title={title}>
      {children}
    </div>
  )
}

export default Tooltip;
