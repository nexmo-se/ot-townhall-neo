import React from "react";
import Firestore from "utils/firestore";
import lodash from "lodash";
import {
  collection,
  orderBy,
  query,
  onSnapshot
} from "@firebase/firestore";

import Question from "entities/question";
import User from "entities/user";

import useStyles from "./styles";
import useSession from "hooks/session";
import { useState, useEffect } from "react";

import QuestionItem from "../QuestionItem";

function QuestionList () {
  const [questions, setQuestions] = useState([]);
  const { session } = useSession();
  const mStyles = useStyles();
  
  useEffect(
    () => {
      if (session) {
        const sessionId = lodash(session).get("sessionId");
        const db = Firestore.getInstance();
        const q = query(
          collection(db, `questions_${sessionId}`),
          orderBy("vote", "desc")
        )

        onSnapshot(q, (querySnapshot) => {
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
        });
      }
    },
    [session]
  )
  
  return (
    <div className={mStyles.root}>
      {
        questions
        .filter(
          (question) => question.status === "open"
        )
        .map(
          (question) => {
            return <QuestionItem key={question.id} question={question} />
          }
        )
      }
    </div>
  );
}
export default QuestionList;