// @flow
import React from "react";
import clsx from "clsx";
import useStyles from "./styles";
import type { Node } from "react";

import VideoControl from "components/VideoControl";

type Props = { children: Node };

function VideoHoverContainer({ children }:Props){
  const [ visible, setVisible ] = React.useState<boolean>(false);
  const mStyles = useStyles();

  function handleMouseEnter(){
    setVisible(true);
  }
  
  function handleMouseLeave(){
    setVisible(false);
  }

  return (
    <div 
      className={mStyles.layer}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={clsx({
        [mStyles.root]: true,
        [mStyles.hidden]: !visible
      })}>
        {children}
      </div>
    </div>
  );
}
export default VideoHoverContainer;