// @flow
import React from "react";
import Question from "entities/question";
import QuestionAPI from "api/question";

import useStyles from "./styles";
import useSession from "hooks/session";

import Vote from "../VoteButton";

interface IQuestionItem { question: Question }
function QuestionItem({ question }: IQuestionItem){
  const { session } = useSession();
  const mStyles = useStyles();

  function handleMarkAsAnswered(){
    QuestionAPI.markAs({ 
      question, 
      status: "answered",
      sessionID: session.id
    });
  }

  function handleMarkAsSelected(){
    QuestionAPI.markAs({ 
      question, 
      status: "selected",
      sessionID: session.id
    });
  }
  
  return (
    <div className={mStyles.root}>
      <Vote question={question} />
      <div className={mStyles.detailContainer}>
        <p><b>{question.owner.name}</b></p>
        <p>{question.content}</p>
        <p>
          <span 
            className="Vlt-text-link"
            onClick={handleMarkAsAnswered}
          >
            Mark as answered
          </span>
        </p>
        {question.status !== "selected" && (
          <p>
            <span
              className="Vlt-text-link"
              onClick={handleMarkAsSelected}
            >
              Select
            </span>
          </p>
        )}
      </div>
    </div>
  )
}
export default QuestionItem;