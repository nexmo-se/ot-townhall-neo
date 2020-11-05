// @flow
import React from "react";

import SettingsModal from "../SettingsModal";
import Button from "components/Button";

function SettingsPanel(){
  const [ modalOpen, setModalOpen ] = React.useState<boolean>(false);

  function toggleOpen(){
    setModalOpen((prev) => !prev)
  }

  return (
    <>
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