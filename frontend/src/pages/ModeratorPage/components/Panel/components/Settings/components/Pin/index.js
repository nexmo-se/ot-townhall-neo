import styles from "./Pin.module.css";

import clsx from "clsx";
import { useState } from "react";
import { useConfiguration } from "components/ConfigurationProvider";

import PinModal from "../PinModal";

function Pin () {
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const { configuration } = useConfiguration();

  function togglePinModal () {
    setPinModalOpen((prev) => !prev);
  }

  return (
    <>
      <p>
        <strong>PIN. &nbsp;</strong>
        System will set default PIN for everyone. You can make it yours by setting it up here
      </p>
      <div
        className={
          clsx(
            "Vlt-purple-dark",
            styles.open
          )
        }
        onClick={togglePinModal}
      >
        Open PIN Setting
      </div>
      <PinModal
        open={pinModalOpen}
        defaultConfiguration={configuration}
        onSaved={togglePinModal}
        onCancelClick={togglePinModal}
      />
    </>
  )
}

export default Pin;
