// @flow
import React from "react";
import User from "entities/user";
import FetchHelper from "helper/fetch";
import useMessage from "hooks/message";
import { v4 as uuid } from "uuid";

import Modal from "components/Modal";
import TextInput from "components/TextInput";

interface IGiveAccess {
  open: boolean;
  onClose: () => void;
  user: User;
}

function GiveAccessModal({ user, open, onClose }: IGiveAccess) {
  const [pin, setPin] = React.useState<string>("");
  const [sending, setSending] = React.useState<boolean>(false);
  const { slidesAccess } = useMessage();

  function handleClose() {
    setPin("");
    if(onClose) onClose();
  }

  function handleGiveAccess() {
    FetchHelper.fetch(
      slidesAccess,
      setSending,
      {
        target: user,
        pin
      },
      { done: handleClose }
    )
  }

  return (
    <Modal
      id={`give-access-modal-${user.id ?? uuid()}`}
      open={open}
    >
      <Modal.Header>
        <h4>Give Slides Access</h4>
        { !sending && (
          <Modal.Dismiss />
        )}
      </Modal.Header>
      <Modal.Content>
        <p>{user.id}</p>
        <p>
          You can give access for your slides to another live participant. However, you need to install chrome extension. Please follow this
          <a
            href="https://chrome.google.com/webstore/detail/remote-for-slides/pojijacppbhikhkmegdoechbfiiibppi?hl=en"
            target="_blank"
            rel="noopener noreferrer"
          >
          &nbsp; link &nbsp;
          </a> if you haven't download the extension.
        </p>
        <TextInput
          label="Remote Share PIN"
          placeholder="eg. 123456"
          text={pin}
          onChange={setPin}
        />
      </Modal.Content>
      <Modal.Footer>
        <button
          className="Vlt-btn Vlt-btn--app Vlt-btn--tertiary"
          onClick={onClose}
          disabled={sending}
        >
          Cancel
        </button>
        <button
          className="Vlt-btn Vlt-btn--app Vlt-btn--secondary"
          onClick={handleGiveAccess}
          disabled={sending}
        >
          Give Access
        </button>
      </Modal.Footer>
    </Modal>
  )
}
export default GiveAccessModal;