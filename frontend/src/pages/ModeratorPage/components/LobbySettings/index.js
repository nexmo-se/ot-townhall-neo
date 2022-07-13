// @flow
import React from 'react';
import { Link } from "react-router-dom";

import { useSettings } from '../SettingsProvider';

import LoginTypeDropdown from '../LoginTypeDropdown';
import TextInput from 'components/TextInput';
import { Grid } from '@material-ui/core';

function LobbySettings() {
  const { lobbySource, setLobbySourceForm } = useSettings();

  function onFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("lobbysource", file);
      setLobbySourceForm(formData);
    }
    else {
      setLobbySourceForm(null);
    }
  }

  return (
    <>
    <p>
      <strong>Lobby Marketing.  </strong>
      This video or Image will be presented in Participant's Waiting Room.
    </p>
    <p>
      Format: mp4, jpg, jpeg, png
    </p>
    <form style={{marginBottom: "16px"}}>
        <input 
          label="Video or Image file"
          type="file"
          name="lobbysource" 
          multiple={false}
          id="lobbysource"
          accept=".jpg, .jpeg, .png, .mp4"
          onChange = {onFileChange}
        />
      </form>
      <p>Link:  <Link to={{ pathname: lobbySource }} target="_blank">{lobbySource}</Link>
      </p>
    </>
  );
}

export default LobbySettings;
