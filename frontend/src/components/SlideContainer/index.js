// @flow
import React from "react";
import useStyles from "./styles";
import { v4 as uuid } from "uuid";

interface ISlideContainer {
  src: string;
  allowInteraction?: boolean;
}

function SlideContainer({ 
  src,
  allowInteraction = false
}: ISlideContainer) {
  const mStyles = useStyles();

  return (
    <div className={mStyles.root}>
      <iframe 
        title={uuid()}
        src={src}
        width="100%"
        height="100%"
        frameBorder="0"
        allowFullScreen={true}
        mozallowfullscreen={true}
        webkitallowfullscreen={true}
        style={{
          pointerEvents: allowInteraction? "auto": "none"
        }}
      />
      <div className={mStyles.control}>
        &nbsp;
      </div>
    </div>
  )
}
export default SlideContainer;