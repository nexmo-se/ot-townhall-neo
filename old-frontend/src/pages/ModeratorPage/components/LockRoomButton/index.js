// @flow
import React, { useEffect } from 'react';
import { useState } from 'react';

import LockIcon from '@material-ui/icons/Lock';
import UnlockIcon from '@material-ui/icons/LockOpen';
import ControlButton from "components/ControlButton";

import OpenRoomModal from "../OpenRoomModal";
import LockRoomModal from "../LockRoomModal";

import { useSettings } from "../SettingsProvider";

interface ILockRoomButton {
  size: number,
  fontSize: number
}

function LockRoomButton({ ...props }: ILockRoomButton){
  const [ isLocked, setIsLocked ] = useState<boolean>(true);
  const [openRoomModal, setOpenRoomModal] = useState<boolean>(false);
  const [lockRoomModal, setLockRoomModal] = useState<boolean>(false);
  const { roomState } = useSettings();

  async function handleClick(){
    if(isLocked) {
      setOpenRoomModal(true);
    }else {
      setLockRoomModal(true);
    }
  }

  function toggleOpenRoomModal () {
    setOpenRoomModal(false);
  }

  function toggleLockRoomModal () {
    setLockRoomModal(false);
  }

  useEffect(() => {
    if (roomState === 'open') setIsLocked(false);
    else setIsLocked(true)
  }, [roomState])

  return (
    <>
    <ControlButton 
      {...props}
      active={!isLocked}
      tooltip={isLocked? "Open Room": "Close Room"}
      onClick={handleClick}
    >
      {isLocked? <LockIcon fontSize="inherit"/>: <UnlockIcon fontSize="inherit"/>}
    </ControlButton>
    <OpenRoomModal
      name="LockRoomOpenRoomModal"
      open={openRoomModal}
      onActionCompleted={toggleOpenRoomModal}
      onCancelClick={toggleOpenRoomModal}
    />
    <LockRoomModal
      open={lockRoomModal}
      onActionCompleted={toggleLockRoomModal}
      onCancelClick={toggleLockRoomModal}
    />
    </>
  )
}

LockRoomButton.defaultProps = { size: 50, fontSize: 24 }
export default LockRoomButton;