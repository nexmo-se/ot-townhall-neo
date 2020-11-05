// @flow
import React from "react";
import clsx from "clsx";

import ModalHeader from "./components/ModalHeader";
import Dismiss from "./components/Dismiss";
import Content from "./components/Content";
import Footer from "./components/Footer";

interface IModal {
  id: string;
  children: any;
  large?: boolean;
  open: boolean;
  onClose?: () => void;
}

function Modal({ id, children, large, open, onClose }: IModal){
  const modalRef = React.useRef();

  React.useEffect(() => {
    if(open) {
      if(!modalRef.current) modalRef.current = window.Volta.modal.create(id);
      modalRef.current.open();
    }else if(!open) {
      if(modalRef.current) {
        modalRef.current.dismiss();
        if(onClose) onClose();
      }
      modalRef.current = undefined;
    }
  }, [ open, onClose, id ])
  
  return (
    <div
      id={id}
      className={clsx({
        "Vlt-modal": true,
        "Vlt-modal--large": large
      })}
      data-disable-esc
      data-disable-click
    >
      <div className="Vlt-modal__panel">
        {children}
      </div>
    </div>
  )
}

Modal.Header = ModalHeader;
Modal.Dismiss = Dismiss;
Modal.Content = Content;
Modal.Footer = Footer;

export default Modal;