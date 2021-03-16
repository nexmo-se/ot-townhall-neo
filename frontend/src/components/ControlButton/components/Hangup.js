// @flow
import React from "react";

import PhoneDisabledIcon from '@material-ui/icons/PhoneDisabled';
import ControlButton from "../index";

function HangupButton () {
  return (
    <ControlButton
      active={false}
      loading={false}
    >
      <PhoneDisabledIcon fontSize="inherit" />
    </ControlButton>
  )
}

HangupButton.defaultProps = { size: 50, fontSize: 24 }
export default HangupButton;