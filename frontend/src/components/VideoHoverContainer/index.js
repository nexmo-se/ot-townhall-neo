// @flow
import React, { useEffect } from "react";
import clsx from "clsx";
import useStyles from "./styles";
import type { Node } from "react";

interface IVideoHoverContainer { videoHoverVisible: Boolean, setVideoHoverVisible: Function, children: Node };
function VideoHoverContainer({ videoHoverVisible, setVideoHoverVisible, children }: IVideoHoverContainer){
  const mStyles = useStyles();

  function handleMouseEnter(){
    setVideoHoverVisible(true);
  }
  
  function handleMouseLeave(){
    setVideoHoverVisible(false);
  }

  return (
    <div 
      className={mStyles.layer}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={clsx({
        [mStyles.root]: true,
        [mStyles.hidden]: !videoHoverVisible
      })}>
        {children}
      </div>
    </div>
  );
}
export default VideoHoverContainer;