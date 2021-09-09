import lodash from "lodash";

import { useRoom } from "../RoomControlProvider";
import { useState } from "react";

import Modal from "components/Modal";
import Button from "components/Button";

function LockRoomModal (props) {
  const isOpen = lodash(props).get("open", false);
  const onActionCompleted = lodash(props).get("onActionCompleted");
  const onCancelClick = lodash(props).get("onCancelClick", () => {});

  const [isLoading, setIsLoading] = useState(false);
  const { toggleRoom } = useRoom();

  async function handleSubmit () {
    try {
      setIsLoading(true);
      await toggleRoom();
      if (onActionCompleted) onActionCompleted();
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

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
