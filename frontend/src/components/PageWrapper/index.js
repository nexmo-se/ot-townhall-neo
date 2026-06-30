// @flow
import React from "react";
import useStyles from "./styles";

interface IPageWrapper {
  children: any;
}

function PageWrapper({ children }: IPageWrapper) {
  const mStyles = useStyles();

  return (
    <div className={mStyles.root}>
      {children}
    </div>
  )
}
export default PageWrapper;