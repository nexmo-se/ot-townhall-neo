// @flow
import React from "react";

import Button from "components/Button";
import Modal from "components/Modal";

interface InfoDialogProps {
  title: string;
  children: any;
  visible: boolean;
  setVisible: (value: boolean) => void;
}

function InfoDialog ({ title, children, visible, setVisible }: InfoDialogProps) {
  function toggleModal () {
    if (visible) setVisible(false);
    if (!visible) setVisible(true);
  }

  return (
    <Modal
      id="info-dialog"
      open={visible}
    >
      <Modal.Header>
        <h3>{title}</h3>
      </Modal.Header>
      <Modal.Content>
        {children}
      </Modal.Content>
      <Modal.Footer>
        <Button
          text="Dismiss"
          onClick={toggleModal}
        />
      </Modal.Footer>
    </Modal>
  )
}

export default InfoDialog;
