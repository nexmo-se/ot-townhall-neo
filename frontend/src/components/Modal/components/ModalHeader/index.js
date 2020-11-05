// @flow
import React from "react";

interface IModalHeader {
  children: any
}

function ModalHeader({ children }: IModalHeader){
  return (
    <div className="Vlt-modal__header">
      {children}
    </div>
  )
}
export default ModalHeader;