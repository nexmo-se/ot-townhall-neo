import { useRoom } from "../RoomControlProvider";
import { useState } from "react";

import OtherControl from "../OtherControl";
import OpenRoomModal from "../OpenRoomModal";
import LockRoomModal from "../LockRoomModal";

function RoomControlButton () {
  const [openRoomModal, setOpenRoomModal] = useState(false);
  const [lockRoomModal, setLockRoomModal] = useState(false);
  const { status } = useRoom();

  function generateColor () {
    if (status === "open") {
      return "green";
    } else if (status === "locked") {
      return "red";
    } else {
      return "red";
    }
  }

  function generateTitle () {
    if (status === "open") {
      return "Open";
    } else if (status === "locked") {
      return "Locked";
    } else {
      return "Unknown";
    }
  }

  function generateIcon () {
    if (status === "open") {
      return "Vlt-icon-unlock-full";
    } else if (status === "locked") {
      return "Vlt-icon-lock-full";
    } else {
      return "Vlt-icon-alert-negative";
    }
  }

  function generateTooltip () {
    if (status === "open") {
      return "Lock Room";
    } else if (status === "locked") {
      return "Unlock Room";
    } else {
      return `Unknown Status: ${status}`;
    }    
  }

  function toggleOpenRoomModal () {
    setOpenRoomModal((prev) => !prev);
  }

  function toggleLockRoomModal () {
    setLockRoomModal((prev) => !prev);
  }

  function handleClick () {
    if (status === "locked") {
      setOpenRoomModal(true);
      setLockRoomModal(false);
    } else if (status === "open") {
      setOpenRoomModal(false);
      setLockRoomModal(true);
    }
  }

  return (
    <>
      <OtherControl
        iconName={generateIcon()}
        iconColor={generateColor()}
        title={generateTitle()}
        tooltip={generateTooltip()}
        onClick={handleClick}
      />

      <OpenRoomModal
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

export default RoomControlButton;
