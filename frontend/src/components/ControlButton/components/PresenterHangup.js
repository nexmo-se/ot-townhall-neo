// @flow
import React from "react";

import useMessage from "hooks/message";
import useSession from "hooks/session";

import PhoneDisabledIcon from '@material-ui/icons/PhoneDisabled';
import Modal from "components/Modal";
import Button from "components/Button";
import ControlButton from "../index";
import { Portal } from "@material-ui/core";
import Tooltip from 'components/Tooltip';

function PresenterHangup () {
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const { session } = useSession();
  const { modalContainer } = useMessage();

  function handleClick () {
    setIsModalOpen(true);
  }

  function handleCancel () {
    setIsModalOpen(false);
  }

  function handleLeave () {
    session.disconnect();
    window.location.replace("/thank-you");
  }

  return (
    <>
      <ControlButton
        active={false}
        loading={false}
        onClick={handleClick}
      >
        <Tooltip title="Leave the Room">
          <PhoneDisabledIcon fontSize="inherit"/>
        </Tooltip>
      </ControlButton>
      <Portal container={modalContainer.current}>
        <Modal
          id="hangup-confirmation"
          open={isModalOpen}
        >
          <Modal.Header>
            <h3>Are you sure you want to leave the room?</h3>
          </Modal.Header>
          <Modal.Content>
            <p>You will leave the room, however, the session will still be there. You can go back anytime you want</p>
          </Modal.Content>
          <Modal.Footer>
            <Button
              text="Cancel"
              className="Vlt-btn--tertiary"
              onClick={handleCancel}
            />
            <Button
              text="Leave"
              className="Vlt-btn--destructive"
              onClick={handleLeave}
            />
          </Modal.Footer>
        </Modal>
      </Portal>
    </>
  )
}

export default PresenterHangup;
