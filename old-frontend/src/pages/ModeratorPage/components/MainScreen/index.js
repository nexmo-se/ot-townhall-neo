// @flow
import React, { useEffect, useState } from "react";
import lodash from "lodash";
import useVOD from "../../hooks/vod";

import VideoContainer from "../VideoContainer";
import OpenRoomModal from "../OpenRoomModal";
import LayoutContainer from "components/LayoutContainer";
import Banner from "components/Banner"
import { useSettings } from "../SettingsProvider";

function MainScreen() {
  const [ showBanner, setShowBanner ] = useState<boolean>(true);
  const [ openModal, setOpenModal] = useState(false);
  const { videoSource } = useVOD();
  const { roomState } = useSettings();

  function handleOpenRoom() {
    setOpenModal(true);
  }

  function toggleOpenModal () {
    setOpenModal(false);
  }

  function handleCloseBanner() {
    setShowBanner(false);
  }

  useEffect(() => {
    if (roomState === 'open') setShowBanner(false);
    else setShowBanner(true)
  }, [roomState])

  return (
    <>
      {showBanner ? <Banner
      text="Room is locked, Open room to allow participants join the session."
      hasButton = {true}
      buttonText="Open Room"
      onClick={handleOpenRoom}
      onClose={handleCloseBanner}
      ></Banner> : null}
      <LayoutContainer
        id="cameraContainer"
        size={lodash.isEmpty(videoSource)? "big": "small"}
      />
      <VideoContainer />
      <OpenRoomModal
        name="MainScreenOpenRoomModal"
        open={openModal}
        onActionCompleted={toggleOpenModal}
        onCancelClick={toggleOpenModal}
      />
    </>
  )
}
export default MainScreen;