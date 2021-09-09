import styles from "./ParticipantPinForm.module.css";
import lodash from "lodash";

import PinForm from "../PinForm";
import Checkbox from "components/Checkbox";

function ParticipantPinForm (props) {
  const value = lodash(props).get("value", {});
  const onChange = lodash(props).get("onChange");
  const disabled = lodash(props).get("disabled", false);

  function handleChange (checked) {
    if (!onChange) return;

    const clonnedValue = lodash(value).clone();
    clonnedValue.raiseHand = checked;
    onChange(clonnedValue);
  }

  return (
    <PinForm
      {...props}
      additionalInput={(
        <Checkbox
          label="Allow participants to raise hand"
          classes={{ 
            container: styles.checkbox
          }}
          checked={value.raiseHand ?? false}
          onChange={handleChange}
          disabled={disabled}
        />
      )}
    />
  )
}

export default ParticipantPinForm;