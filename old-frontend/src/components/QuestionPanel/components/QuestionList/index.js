// @flow
import React from "react";
import Firestore from "utils/firestore";

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
      const db = Firestore.getInstance();
      const { sessionId: sessionID } = mSession.session;
      db.collection(`questions_${sessionID}`).orderBy("vote", "desc").onSnapshot((querySnapshot) => {
        const questions = querySnapshot.docs.map((documentSnapshop) => {
          const data = documentSnapshop.data();
          const user = new User({ name: data.owner.name, role: data.owner.role });
          user.id = data.owner.id;
          
          const question = new Question({
            id: documentSnapshop.id,
            owner: user,
            content: data.content,
            vote: data.vote,
            voters: data.voters,
            status: data.status
          });
          return question;
        });
        setQuestions(questions);
      })
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