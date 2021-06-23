// @flow

import React from "react";
import clsx from "clsx";
import { createRef } from "react";

import useStyles from "./styles";
import { useEffect } from "react";

interface TooltipProps {
  children: any;
  title: string;
}

function Tooltip ({ children, title }: TooltipProps) {
  const mStyles = useStyles();
  const tooltipRef = createRef();

  useEffect(
    () => {
      window.Volta.tooltip.create(tooltipRef.current);
    },
    [tooltipRef]
  );

  return (
    <div
      ref={tooltipRef}
      className={
        clsx(
          "Vlt-tooltip",
          "Vlt-tooltip--top",
          mStyles.container
        )
      }
      title={title}
    >
      {children}
    </div>
  )
}

export default Tooltip;
