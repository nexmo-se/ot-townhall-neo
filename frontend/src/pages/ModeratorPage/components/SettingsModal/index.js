// @flow
import React from "react";
import { useSettings } from "../SettingsProvider";

import ResetSettings from "../ResetSettings";
import PinSettings from "../PinSettings";
import TabsSettings from "../TabsSettings";
import Modal from "components/Modal";

interface ISettingsModal {
  open: boolean;
  onClose: () => void;
}

function SettingsModal({ open, onClose }: ISettingsModal){
  const [saving, setSaving] = React.useState<boolean>(false);
  const { saveSettings, fetchConfiguration } = useSettings();

  async function handleSave() {
    try {
      setSaving(true);
      await saveSettings();
      if (onClose) onClose();
    } finally {
      setSaving(false);
    }
  }

  React.useEffect(() => {
    if (open) fetchConfiguration()
  }, [open, fetchConfiguration])
  
  return (    
    <Modal 
      id="settings-modal"
      open={open}
      large
    >
      <Modal.Header>
        <h4>Settings</h4>
        <Modal.Dismiss />
      </Modal.Header>
      <Modal.Content>
        <PinSettings />
        <hr className="hr--tall Vlt-gradient--blue-to-pink"></hr>
        <TabsSettings />
        <hr className="hr--tall Vlt-gradient--blue-to-pink"></hr>
        <ResetSettings clear={open} />
      </Modal.Content>
      <Modal.Footer>
        <button
          className="Vlt-btn Vlt-btn--app Vlt-btn--tertiary"
          onClick={onClose}
          disabled={saving}
        >
          Cancel
        </button>
        <button
          className="Vlt-btn Vlt-btn--app Vlt-btn--secondary"
          onClick={handleSave}
          disabled={saving}
        >
          Save
        </button>
      </Modal.Footer>
    </Modal>
  )
}
export default SettingsModal;
