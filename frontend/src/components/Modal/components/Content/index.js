// @flow
import React from "react";

interface IContent {
  children?: any
}

function Content({ children }: IContent){
  return (
    <div className="Vlt-modal__content">
      {children}
    </div>
  )
}
export default Content;