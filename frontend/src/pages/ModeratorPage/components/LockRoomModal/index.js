import React from 'react';

import lodash from "lodash";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";

import Modal from "components/Modal";
import Button from "components/Button";

import { useSettings } from "../SettingsProvider";

function LockRoomModal (props) {
  const isOpen = lodash(props).get("open", false);
  const onActionCompleted = lodash(props).get("onActionCompleted");
  const onCancelClick = lodash(props).get("onCancelClick", () => {});

  const [isLoading, setIsLoading] = useState(false);
  const [updateSetting, setUpdateSetting] = useState(false);
  const { saveSettings, setRoomState, roomState, participantLoginType } = useSettings();
  const { tenant } = useParams();

  async function handleSubmit () {
    try {
      setIsLoading(true);
      setRoomState('locked');
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
    if (updateSetting && roomState === 'locked') saveConfig();
  }, [roomState, updateSetting])

  return (
    <Modal
      id="modal-lock-room"
      open={isOpen}
    >
      <Modal.Header>
        <h3>Are you sure?</h3>
      </Modal.Header>
      <Modal.Content>
        Remaining participants won't be able to enter the room.
        However, participants that currently in the room will still be in the room.
      </Modal.Content>
      <Modal.Footer>
        <Button
          text="Keep It Open"
          className="Vlt-btn--tertiary"
          onClick={onCancelClick}
          disabled={isLoading}
        />
        <Button
          text="Yes, Close It!"
          className="Vlt-btn--secondary"
          onClick={handleSubmit}
          disabled={isLoading}
        />
      </Modal.Footer>
    </Modal>
  )
}

export default LockRoomModal;
