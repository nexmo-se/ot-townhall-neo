// @flow
import React, { useEffect } from 'react';
import { useState } from 'react';
import User from "entities/user";

import useSession from "hooks/session";
import RemoveParticipantsIcon from '@material-ui/icons/RemoveFromQueue';
import ControlButton from "components/ControlButton";

import RemoveParticipantsModal from "../RemoveParticipantsModal";

interface IRemoveParticipantsButton {
  size: number,
  fontSize: number
}

function RemoveParticipantsButton({ ...props }: IRemoveParticipantsButton){
  const [openRemoveParticipantsModal, setOpenRemoveParticipantsModal] = useState<boolean>(false);
  const [isParticipantExist, setIsParticipantExist] = useState<boolean>(false)
  const { connections } = useSession();

  useEffect(() => {
    if (connections) {
      const participants = connections.find((connection) => {
        const data = JSON.parse(connection.data);
        const user = User.fromJSON(data);
        if (user.role == "participant") {
          return user;
        }
      });
      setIsParticipantExist(participants ? true : false)
    }
  }, [connections])

  async function handleClick(){
   if (isParticipantExist) {
    setOpenRemoveParticipantsModal(true);
   }
  }

  function toggleRemoveParticipantsModal () {
    setOpenRemoveParticipantsModal(false);
  }

  return (
    <>
    <ControlButton 
      {...props}
      active={isParticipantExist}
      tooltip={"Remove participants"}
      onClick={handleClick}
    >
      <RemoveParticipantsIcon fontSize="inherit"/>
    </ControlButton>
    <RemoveParticipantsModal
      name="OpenRemoveParticipantsModel"
      open={openRemoveParticipantsModal}
      onActionCompleted={toggleRemoveParticipantsModal}
      onCancelClick={toggleRemoveParticipantsModal}
    />
    </>
  )
}

RemoveParticipantsButton.defaultProps = { size: 50, fontSize: 24 }
export default RemoveParticipantsButton;