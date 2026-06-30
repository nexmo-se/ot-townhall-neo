// @flow
import React from "react";

interface IFooter { 
  children?: any
}

function Footer({ children }: IFooter){
  return (
    <div className="Vlt-modal__footer">
      {children}
    </div>
  )
}
export default Footer;