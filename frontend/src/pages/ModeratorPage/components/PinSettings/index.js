// @flow
import React from "react";
import { useSettings } from "../SettingsProvider";

import LoginTypeDropdown from "../LoginTypeDropdown";
import TextInput from "components/TextInput";
import { Grid } from "@material-ui/core";

function PinSettings() {
  const {
    presenterPin,
    participantPin,
    moderatorPin,
    participantLoginType,
    setParticipantLoginType,
    presenterLoginType,
    moderatorLoginType,
    allowRaiseHand,
    setAllowRaiseHand,
    setPresenterLoginType,
    setModeratorLoginType,
    setPresenterPin,
    setParticipantPin,
    setModeratorPin
  } = useSettings();

  function handleAllowRaiseHandChange (e: any) {
    setAllowRaiseHand(e.target.checked);
  }

  return (
    <>
      <p>System will set default PIN for everyone. You can make it yours by setting it up here</p>
      <p>
        <strong>Note: </strong>
        Leave it blank if you don't wish to change PIN.
      </p>
      <Grid spacing={2} container>
        <Grid xs={4} item>
          <LoginTypeDropdown
            value={presenterLoginType}
            onChange={setPresenterLoginType}
          />
        </Grid>
        <Grid xs item>
          <TextInput 
            label="Presenter PIN"
            text={presenterPin}
            onChange={setPresenterPin}
            type="text"
            placeholder="Enter new pin here"
            autoComplete="off"
          />
        </Grid>
      </Grid>
      
      <Grid spacing={2} container>
        <Grid xs={4} item>
          <LoginTypeDropdown
            value={moderatorLoginType}
            onChange={setModeratorLoginType}
          />
        </Grid>
        <Grid xs item>
          <TextInput 
            label="Moderator PIN"
            text={moderatorPin}
            onChange={setModeratorPin}
            type="text"
            placeholder="Enter new pin here"
            autoComplete="off"
          />
        </Grid>
      </Grid>

      <Grid spacing={2} container>
        <Grid xs={4} item>
          <LoginTypeDropdown
            value={participantLoginType}
            onChange={setParticipantLoginType}
          />
        </Grid>
        <Grid xs item>
          <TextInput 
            label="Participant PIN"
            text={participantPin}
            onChange={setParticipantPin}
            type="text"
            placeholder="Enter new pin here"
            autoComplete="off"
          />
          <div className="Vlt-checkbox">
            <label for="allow-raise-hand">
              <span class="Vlt-checkbox__button">
                <input
                  type="checkbox"
                  id="allow-raise-hand"
                  onChange={handleAllowRaiseHandChange}
                  checked={allowRaiseHand}
                />
                <span class="Vlt-checkbox__icon"></span>
              </span>
              Allow participants to raise hand
            </label>
          </div>
        </Grid>
      </Grid>
    </>
  )
}

export default PinSettings;
