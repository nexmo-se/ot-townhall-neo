import React from "react";
import { SettingsContext } from "../contexts/settings";

export function useSettings() {
  return React.useContext(SettingsContext);
}
