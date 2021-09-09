// @flow
import React from "react";
import { useParams } from "react-router-dom";

import SettingsModal from "../SettingsModal";
import SettingsProvider from "../SettingsProvider";
import Button from "components/Button";

interface IParams {
  tenant: string;
}

function SettingsPanel(){
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const { tenant } = useParams<IParams>();

  function toggleOpen(){
    setModalOpen((prev) => !prev)
  }

  return (
    <SettingsProvider tenant={tenant}>
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
    </SettingsProvider>
  )
}
export default SettingsPanel;