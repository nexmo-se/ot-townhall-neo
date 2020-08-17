// @flow
import React from "react";
import clsx from "clsx";

type Props = {
  text: string,
  style?: any,
  className?: any,
  onChange?: (value:string) => void
}

function TextInput({ text, style, className, onChange, ...props }:Props){

  function handleChange({ target }){
    if(onChange) onChange(target.value);
  }

  return(
    <div 
      className={clsx(
        "Vlt-form__element",
        className
      )}
      style={style}
    >
      <div className="Vlt-input">
        <input
          {...props}
          onChange={handleChange}
          value={text} 
        />
      </div>
    </div>  
  )
}

TextInput.defaultProps = { placeholder: "Say something..." }
export default TextInput;