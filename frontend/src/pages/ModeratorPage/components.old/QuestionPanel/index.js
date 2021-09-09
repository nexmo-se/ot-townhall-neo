// @flow
import React from "react";

import QuestionInput from "./components/QuestionInput";
import QuestionList from "./components/QuestionList";
import QuestionDownload from "./components/QuestionDownload";

function QuestionPanel(){
  return (
    <React.Fragment>
      <QuestionDownload />
      <QuestionList />
      <QuestionInput />
    </React.Fragment>
  );
}
export default QuestionPanel;