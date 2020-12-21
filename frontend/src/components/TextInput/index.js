// @flow
import React from "react";
import clsx from "clsx";

interface ITextInput {
  text: string,
  label?: string,
  style?: any,
  className?: any,
  onChange?: (value:string) => void
}

function TextInput({ 
  text, 
  label,
  style, 
  className, 
  onChange, 
  ...props 
}: ITextInput) {

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
      { label && (
        <label className="Vlt-label">{label}</label> 
      )}
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