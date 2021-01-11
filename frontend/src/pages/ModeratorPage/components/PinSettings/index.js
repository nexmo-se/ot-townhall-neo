// @flow
import React from "react";
import { useSettings } from "../SettingsProvider";

import TextInput from "components/TextInput";

function PinSettings() {
  const {
    presenterPin,
    participantPin,
    moderatorPin,
    setPresenterPin,
    setParticipantPin,
    setModeratorPin
  } = useSettings();

  return (
    <>
      <p>System will set default PIN for everyone. You can make it yours by setting it up here</p>
      <p>
        <strong>Note: </strong>
        Leave it blank if you don't wish to change PIN.
      </p>
      <TextInput 
        label="Presenter PIN"
        text={presenterPin}
        onChange={setPresenterPin}
        type="password"
        placeholder="Enter new pin here"
        autoComplete="off"
      />

      <TextInput 
        label="Moderator PIN"
        text={moderatorPin}
        onChange={setModeratorPin}
        type="password"
        placeholder="Enter new pin here"
        autoComplete="off"
      />

      <TextInput 
        label="Participant PIN"
        text={participantPin}
        onChange={setParticipantPin}
        type="password"
        placeholder="Enter new pin here"
        autoComplete="off"
      />
    </>
  )
}

export default PinSettings;
