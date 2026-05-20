// @flow
import React from "react";
import QuestionStream from "utils/firestore";

import Question from "entities/question";
import User from "entities/user";

import useStyles from "./styles";
import useSession from "hooks/session";
import QuestionItem from "../QuestionItem";

function QuestionList(){
  const [ questions, setQuestions ] = React.useState<Array<Question>>([]);
  const mStyles = useStyles();
  const mSession = useSession();
  
  React.useEffect(() => {
    if(mSession.session){
      const { sessionId: sessionID } = mSession.session;
      const unsubscribe = QuestionStream.subscribe(sessionID, (questionsData) => {
        const questions = questionsData.map((data) => {
          const user = new User({ name: data.owner.name, role: data.owner.role });
          user.id = data.owner.id;
          
          const question = new Question({
            id: data.id,
            owner: user,
            content: data.content,
            vote: data.vote,
            voters: data.voters,
            status: data.status
          });
          return question;
        });
        // Sort by vote descending
        questions.sort((a, b) => b.vote - a.vote);
        setQuestions(questions);
      });
      return () => unsubscribe();
    }
  }, [ mSession.session ])
  
  return (
    <div className={mStyles.root}>
      {questions.filter((question) => question.status === "open").map((question) => {
        return <QuestionItem key={question.id} question={question} />
      })}
    </div>
  );
}
export default QuestionList;