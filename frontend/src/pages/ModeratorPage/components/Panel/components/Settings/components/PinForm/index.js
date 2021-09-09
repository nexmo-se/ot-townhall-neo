import styles from "./PinForm.module.css";

import lodash from "lodash";
import clsx from "clsx";
import { Login } from "components/ConfigurationProvider";

import TextInput from "components/TextInput";
import { Grid } from "@material-ui/core";

const LOGIN_TYPES = [
  { id: "sso", value: "Google SSO" },
  { id: "default", value: "PIN Only" },
  { id: "ama", value: "Customer Detatils" }
]

function PinForm (props) {
  const label = lodash(props).get("label", "PIN");
  const value = lodash(props).get("value", new Login());
  const onChange = lodash(props).get("onChange");
  const additionalInput = lodash(props).get("additionalInput");
  const disabled = lodash(props).get("disabled", false);

  function handleLoginTypeChange (e) {
    if (!onChange) return;

    const clonnedValue = lodash(value).clone();
    clonnedValue.loginType = e.target.value;
    onChange(clonnedValue);
  }

  function handlePinChange (pin) {
    if (!onChange) return;

    const clonnedValue = lodash(value).clone();
    clonnedValue.pin = pin;
    onChange(clonnedValue);
  }
  
  return (
    <Grid spacing={2} container>
      <Grid xs={4} item>
        <div
          className={
            clsx(
              "Vlt-form__element",
              styles.noPaddingBottom
            )
          }
        >
          <label className="Vlt-label">
            Login Type
          </label>
        </div>
        <div className="Vlt-native-dropdown Vlt-native-dropdown--app">
          <select
            value={value.loginType ?? "default"}
            onChange={handleLoginTypeChange}
            disabled={disabled}
          >
            {
              LOGIN_TYPES.map(
                (loginType) => (
                  <option
                    key={loginType.id}
                    value={loginType.id}
                  >
                    {loginType.value}
                  </option>
                )
              )
            }
          </select>
        </div>
      </Grid>
      <Grid xs item>
        <TextInput
          label={label}
          text={value.pin ?? ""}
          onChange={handlePinChange}
          type="text"
          placeholder="Enter new PIN here..."
          autoComplete="off"
          className={styles.noPaddingBottom}
          disabled={disabled}
        />
        { additionalInput ?? null }
      </Grid>
    </Grid>
  )
}

export default PinForm;
