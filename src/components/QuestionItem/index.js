// @flow
import React from "react";
import Question from "entities/question";
import useStyles from "./styles";
import Vote from "./Vote";

type Props = { question: Question }

function QuestionItem({ question }:Props){
  const mStyles = useStyles();
  
  return (
    <div className={mStyles.root}>
      <Vote question={question} />
      <div className={mStyles.detailContainer}>
        <p><b>{question.owner.name}</b></p>
        <p>{question.content}</p>
      </div>
    </div>
  )
}
export default QuestionItem;