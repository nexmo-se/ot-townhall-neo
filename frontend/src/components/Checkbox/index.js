import lodash from "lodash";
import clsx from "clsx";

function Checkbox (props) {
  const value = lodash(props).get("value");
  const checked = lodash(props).get("checked", false);
  const label = lodash(props).get("label", "");
  const disabled = lodash(props).get("disabled", false);
  const onChange = lodash(props).get("onChange");
  const classes = lodash(props).get("classes", {
    container: null
  })
  
  function handleChange (e) {
    if (onChange) onChange(e.target.checked);
  }

  return (
    <div
      className={
        clsx(
          "Vlt-checkbox",
          classes.container
        )
      }
    >
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