import React from "react";
import clsx from "clsx";
import lodash from "lodash";

function TextInput (props) {
  const text = lodash(props).get("text");
  const label = lodash(props).get("label");
  const style = lodash(props).get("style");
  const className = lodash(props).get("className");
  const onChange = lodash(props).get("onChange");

  function handleChange ({ target }){
    if(onChange) onChange(target.value);
  }

  return(
    <div 
      className={
        clsx(
          "Vlt-form__element",
          className
        )
      }
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