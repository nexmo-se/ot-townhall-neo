// @flow
import React from "react";
import useStyles from "./styles";
import type { Node } from "react";

type Props = { children: Node };

function VideoHoverContainer({ children }:Props){
  const mStyles = useStyles();

  return (
    <div className={mStyles.layer}>
      
    </div>
  );
}
export default VideoHoverContainer;