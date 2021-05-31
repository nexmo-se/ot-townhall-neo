// @flow
import React from "react";

import Button from "components/Button";
import Modal from "components/Modal";

interface InfoDialogProps {
  id: string;
  title: string;
  children: any;
  visible: boolean;
  setVisible: (value: boolean) => void;
}

function InfoDialog ({ id, title, children, visible, setVisible }: InfoDialogProps) {
  function toggleModal () {
    if (visible) setVisible(false);
    if (!visible) setVisible(true);
  }

  return (
    <Modal
      id={id}
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
