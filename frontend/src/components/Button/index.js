// @flow
import React from "react";
import clsx from "clsx";

interface ButtonProps {
  text: string;
  onClick?: Function;
  className?: any;
}

function Button ({ text, className, onClick, ...props }: ButtonProps) {

  function handleClick (e) {
    e.preventDefault();
    if(onClick) onClick();
  }

  return (
    <button 
      {...props}
      className={clsx(
        "Vlt-btn",
        "Vlt-btn--primary",
        "Vlt-btn--app",
        className
      )}
      onClick={handleClick} 
      type="submit"
    >
      {text}
    </button>
  )
}
export default Button;