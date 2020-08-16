// @flow
import React from "react";
import Question from "entities/question";
import useStyles from "./styles";

import Icon from "components/Icon";

type Props = { question: Question }

function QuestionItem({ question }:Props){
  const mStyles = useStyles();
  
  return (
    <div className={mStyles.root}>
      <div className={mStyles.voteContainer}>
        <Icon name="Vlt-icon-up" />
        <p>{question.vote}</p>
        <span>Vote</span>
      </div>
      <div className={mStyles.detailContainer}>
        <p><b>{question.owner.name}</b></p>
        <p>{question.content}</p>
      </div>
    </div>
  )
}
export default QuestionItem;