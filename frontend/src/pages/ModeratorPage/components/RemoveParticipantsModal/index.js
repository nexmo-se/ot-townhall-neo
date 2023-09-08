import React from 'react';
import { useState, useEffect, useCallback } from "react";

import lodash from "lodash";
import User from "entities/user";

import Modal from "components/Modal";
import Button from "components/Button";

import { useSettings } from "../SettingsProvider";
import useSession from 'hooks/session';

function RemoveParticipantsModal (props) {
  const isOpen = lodash(props).get("open", false);
  const onActionCompleted = lodash(props).get("onActionCompleted");
  const onCancelClick = lodash(props).get("onCancelClick", () => {});
  const name = lodash(props).get("name", "openModal");

  const [isLoading, setIsLoading] = useState(false);
  const { session, connections} = useSession()

  async function handleSubmit () {
    try {
      setIsLoading(true);
      connections.forEach((connection) => {
        const data = JSON.parse(connection.data);
        const user = User.fromJSON(data);
        if (user.role == "participant") {
            session.forceDisconnect(connection)
        }
      });

    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
      if (onActionCompleted) onActionCompleted();
    }
  }

  return (
    <Modal
      id={name}
      open={isOpen}
    >
      <Modal.Header>
        <h3>Are you sure?</h3>
      </Modal.Header>
      <Modal.Content>
        All participants will be disconnected from the room.
      </Modal.Content>
      <Modal.Footer>
        <Button
          text="Cancel"
          className="Vlt-btn--tertiary"
          onClick={onCancelClick}
          disabled={isLoading}
        />
        <Button
          text="Disconnect Participants"
          className="Vlt-btn--secondary"
          onClick={handleSubmit}
          disabled={isLoading}
        />
        {isLoading ? <div className="Vlt-spinner Vlt-spinner--smaller" style={{verticalAlign: "middle"}}/> : null}
      </Modal.Footer>
    </Modal>
  )
}

export default RemoveParticipantsModal;
