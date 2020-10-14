// @flow
import React from "react";
import clsx from "clsx";
import useStyles from "./styles";
import type { Node } from "react";

interface IVideoHoverContainer { children: Node };
function VideoHoverContainer({ children }: IVideoHoverContainer){
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