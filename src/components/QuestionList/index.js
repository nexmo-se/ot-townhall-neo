// @flow
import React from "react";
import useStyles from "./styles";

import QuestionItem from "components/QuestionItem";

function QuestionList(){
  const mStyles = useStyles();
  
  return (
    <div className={mStyles.root}>
      <QuestionItem />
    </div>
  );
}
export default QuestionList;