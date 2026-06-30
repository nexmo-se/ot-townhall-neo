// @flow
import React from "react";
import { v4 as uuid } from "uuid";

interface IIFrame {
  src: string;
  allowInteraction?: boolean;
}

function IFrame({
  src,
  allowInteraction = true
}: IIFrame) {
  return (
    <iframe 
      title={uuid()}
      src={src}
      width="100%"
      height="100%"
      style={{
        pointerEvents: allowInteraction? "auto": "none"
      }}
    />
  )
}
export default IFrame;