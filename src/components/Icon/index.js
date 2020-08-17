// @flow
import voltaIcon from "@vonagevolta/volta2/dist/symbol/volta-icons.svg";
import React from "react";
import clsx from "clsx";

type Props = { 
  name: string,
  className?: any
}

function Icon({ name, className }:Props){
  return (
    <svg className={clsx(
      "Vlt-icon",
      className
    )}>
      <use xlinkHref={`${voltaIcon}#${name}`} />
  </svg>
  )
}
export default Icon;