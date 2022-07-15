import React from 'react';

import lodash from "lodash";

import { useState, useEffect, useCallback } from "react";

import Modal from "components/Modal";
import Button from "components/Button";

import { useSettings } from "../SettingsProvider";

function OpenRoomModal (props) {
  const isOpen = lodash(props).get("open", false);
  const onActionCompleted = lodash(props).get("onActionCompleted");
  const onCancelClick = lodash(props).get("onCancelClick", () => {});
  const name = lodash(props).get("name", "openModal");


  const [isLoading, setIsLoading] = useState(false);
  const [updateSetting, setUpdateSetting] = useState(false);
  const { saveSettings, setRoomState, roomState } = useSettings();

  async function handleSubmit () {
    try {
      setIsLoading(true);
      setRoomState('open');
      setUpdateSetting(true);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  const saveConfig = useCallback(
    async () => {
      await saveSettings();
      if (onActionCompleted) onActionCompleted();
    },
    [onActionCompleted, saveSettings]
  )

  useEffect(() => {
    if (updateSetting && roomState === 'open') saveConfig();
  }, [roomState, updateSetting])

  return (
    <Modal
      id={name}
      open={isOpen}
    >
      <Modal.Header>
        <h3>Are you sure?</h3>
      </Modal.Header>
      <Modal.Content>
        All participants will be notified, and they are able to enter the room.
      </Modal.Content>
      <Modal.Footer>
        <Button
          text="Keep It Closed"
          className="Vlt-btn--tertiary"
          onClick={onCancelClick}
          disabled={isLoading}
        />
        <Button
          text="Yes, Open!"
          className="Vlt-btn--secondary"
          onClick={handleSubmit}
          disabled={isLoading}
        />
        {isLoading ? <div className="Vlt-spinner Vlt-spinner--smaller" style={{verticalAlign: "middle"}}/> : null}
      </Modal.Footer>
    </Modal>
  )
}

export default OpenRoomModal;
