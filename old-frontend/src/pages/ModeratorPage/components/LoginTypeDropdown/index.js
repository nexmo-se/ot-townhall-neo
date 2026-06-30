import React from "react";
import { Box } from "@material-ui/core";

const loginTypes = [
  { id: "sso", value: "Google SSO" },
  { id: "default", value: "PIN Only" },
  { id: "ama", value: "Customer Detatils" }
]

interface ILoginTypeDropdown {
  value: string;
  onChange: (value: string) => void;
}

function LoginTypeDropdown({ value, onChange }: ILoginTypeDropdown) {

  function handleChange(e: React.ChangeEvent<React.HTMLSelectElement>) {
    if (onChange) onChange(e.target.value);
  }

  return (
    <Box className="Vlt-form__element">
      <label className="Vlt-label">
        Login Type
      </label>
      <Box className="Vlt-native-dropdown Vlt-native-dropdown--app">
        <select
          value={value}
          onChange={handleChange}
        >
          {
            loginTypes.map((loginType) => (
              <option
                key={loginType.id}
                value={loginType.id}
              >
                {loginType.value}
              </option>
            ))
          }
        </select>
      </Box>
    </Box>
  )
}

export default LoginTypeDropdown;
