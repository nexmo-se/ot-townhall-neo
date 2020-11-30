// @flow
import React from "react";

import SlideContainer from "components/SlideContainer";
import LayoutContainer from "components/LayoutContainer";

function MainScreen() {
  return (
    <>
      <LayoutContainer
        id="cameraContainer"
        size="small"
      />
      <SlideContainer
        src="https://docs.google.com/presentation/d/e/2PACX-1vQy9_CG_ChBtmpIemHO_zB3XXfxWWTK_0NAPJpNmBusiuruxrANFJM5-iEpKzcGuA/embed?start=false&loop=false&delayms=3000"
        allowInteraction
      />
    </>
  )
}
export default MainScreen;