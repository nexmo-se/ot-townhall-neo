// @flow
import React from "react";

import QuestionInput from "./components/QuestionInput";
import QuestionList from "./components/QuestionList";

function QuestionPanel(){
  return (
    <React.Fragment>
      <QuestionList />
      <QuestionInput />
    </React.Fragment>
  );
}
export default QuestionPanel;