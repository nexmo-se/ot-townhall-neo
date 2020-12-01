// @flow
import React from "react";
import User from "entities/user";
import useMessage from "hooks/message";

import Modal from "components/Modal";
import TextInput from "components/TextInput";

interface IGiveAccess {
  open: boolean;
  onClose: () => void;
  user: User;
}

function GiveAccessModal({ user, open, onClose }: IGiveAccess) {
  const [ pin, setPin ] = React.useState<string>("");
  const { slidesAccess } = useMessage();

  function handleSave() {
    slidesAccess({ user });
  }

  return (
    <Modal
      id="give-access-modal"
      open={open}
    >
      <Modal.Header>
        <h4>Give Slides Access</h4>
        <Modal.Dismiss />
      </Modal.Header>
      <Modal.Content>
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
        >
          Cancel
        </button>
        <button
          className="Vlt-btn Vlt-btn--app Vlt-btn--secondary"
          onClick={handleSave}
        >
          Give Access
        </button>
      </Modal.Footer>
    </Modal>
  )
}
export default GiveAccessModal;