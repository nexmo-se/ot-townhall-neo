// @flow
import React from "react";

interface ICheckbox {
  value: string;
  checked: boolean;
  label: string;
  disabled?: boolean;
  onChange?: (value: boolean) => void
}

function Checkbox({ 
  value,
  checked,
  label,
  disabled = false,
  onChange
}: ICheckbox){
  
  function handleChange(e){
    if(onChange) onChange(e.target.checked);
  }

  return (
    <div className="Vlt-checkbox">
      <label htmlFor={value}>
        <span className="Vlt-checkbox__button">
          <input 
            type="checkbox" 
            id={value} 
            value={value} 
            onChange={handleChange}
            checked={checked}
            disabled={disabled}
          />
          <span className="Vlt-checkbox__icon"></span>
        </span>
        {label}
      </label>
    </div>
  )
}
export default Checkbox;