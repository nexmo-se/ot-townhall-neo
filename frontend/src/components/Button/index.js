// @flow
import React from "react";
import clsx from "clsx";

type Props = {
  text: string, 
  onClick?: (e:any) => Promise<any> | void,
  className?: any
}

function Button({ text, className, onClick, ...props }:Props){

  function handleClick (e) {
    e.preventDefault();
    if(onClick) onClick(e);
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