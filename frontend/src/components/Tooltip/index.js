import styles from "./Tooltip.module.css";

import clsx from "clsx";
import { createRef } from "react";
import { useEffect } from "react";

function Tooltip ({ children, title }) {
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
          styles.container
        )
      }
      title={title}
    >
      {children}
    </div>
  )
}

export default Tooltip;
