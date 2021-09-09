import React from "react";
import clsx from "clsx";
import lodash from "lodash";

function Button (props) {
  const text = lodash(props).get("text");
  const className = lodash(props).get("className");
  const onClick = lodash(props).get("onClick");

  function handleClick (e) {
    e.preventDefault();
    if (onClick) onClick();
  }

  return (
    <button 
      {...props}
      className={
        clsx(
          "Vlt-btn",
          "Vlt-btn--primary",
          "Vlt-btn--app",
          className
        )
      }
      onClick={handleClick} 
      type="submit"
    >
      {text}
    </button>
  )
}

export default Button;
