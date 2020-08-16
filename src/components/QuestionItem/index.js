// @flow
import React from "react";
import useStyles from "./styles";

import Icon from "components/Icon";

function QuestionItem(){
  const mStyles = useStyles();
  
  return (
    <div className={mStyles.root}>
      <div className={mStyles.voteContainer}>
        <Icon name="Vlt-icon-up" />
        <p>0</p>
        <span>Vote</span>
      </div>
      <div className={mStyles.detailContainer}>
        <p><b>Name</b></p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed accumsan sit amet neque vel rhoncus. Nulla rhoncus mi eu orci ultrices, eu ullamcorper leo aliquam. </p>
      </div>
    </div>
  )
}
export default QuestionItem;