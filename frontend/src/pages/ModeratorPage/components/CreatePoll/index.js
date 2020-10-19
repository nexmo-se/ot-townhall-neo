// @flow
import React from "react";

import PollingModal from "../PollingModal";
import Button from "components/Button";

function CreatePoll(){
  const [ modalOpen, setModalOpen ] = React.useState<boolean>(false);
  
  function toggleCreateModal(){
    setModalOpen((prev) => !prev);
  }

  return (
    <>
      <Button text="Create Polling" onClick={toggleCreateModal} />
      <PollingModal open={modalOpen} onClose={toggleCreateModal} />
    </>
  )
}
export default CreatePoll;