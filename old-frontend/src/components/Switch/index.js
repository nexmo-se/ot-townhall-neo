// @flow
import React from "react";

interface SwitchProps {
  value: boolean;
  setValue: (value: boolean) => void;
}

function Switch ({ value, setValue }: SwitchProps) {

  function handleChange (e) {
    if (!setValue) {
      e.preventDefault()
    } else {
      setValue(e.target.checked);
    }
  }

  return (
    <div className="Vlt-switch">
      <label>
        <input
          type="checkbox"
          checked={value}
          onChange={handleChange}
        />
        <span className="Vlt-switch__slider" />
      </label>
    </div>
  )
}

export default Switch;
