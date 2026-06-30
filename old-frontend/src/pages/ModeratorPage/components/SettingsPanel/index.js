// @flow
import React from "react";

import SettingsModal from "../SettingsModal";
import Button from "components/Button";

function SettingsPanel(){
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);

  function toggleOpen(){
    setModalOpen((prev) => !prev)
  }

  return (
    <>
      <p>Go to here if you want:</p>
      <ul className="Vlt-list Vlt-list--simple">
        <li>Clear Questions</li>
        <li>Clear Pollings</li>
        <li>Clear Session</li>
        <li>Change PIN</li>
        <li>Tab Configurations</li>
      </ul>
      <Button 
        text="Show all settings" 
        onClick={toggleOpen}
      />
      <SettingsModal 
        onClose={toggleOpen}
        open={modalOpen}
      />
    </>
  )
}
export default SettingsPanel;