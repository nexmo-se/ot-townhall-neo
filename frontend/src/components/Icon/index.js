// @flow
import voltaIcon from "@vonagevolta/volta2/dist/symbol/volta-icons.svg";
import React from "react";
import clsx from "clsx";

function Icon({ name, className }) {

  const Icon = React.useMemo(() => {
    return (
      <svg 
        className={clsx(
          "Vlt-icon",
          className
        )}
      >
        <use xlinkHref={`${voltaIcon}#${name}`} />
      </svg>
    )
  }, [name, className])

  return Icon;
}

export default Icon;