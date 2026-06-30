// @flow
import React from "react";
import QuestionStream from "utils/firestore";
import clsx from "clsx";

import Question from "entities/question";
import User from "entities/user";

import useStyles from "./styles";
import useSession from "hooks/session";

import Marquee from 'react-double-marquee';

function SelectedQuestion(){
  const [ selected, setSelected ] = React.useState<Question | void>();
  const mStyles = useStyles();
  const { session } = useSession();
  
  React.useEffect(() => {
    if(session?.id){
      const unsubscribe = QuestionStream.subscribe(session.id, (questions) => {
        const selectedQuestion = questions.find(q => q.status === "selected");
        if(selectedQuestion){
          const question = new Question({
            id: selectedQuestion.id,
            owner: new User({ 
              id: selectedQuestion.owner?.id,
              name: selectedQuestion.owner?.name, 
              role: selectedQuestion.owner?.role
            }),
            content: selectedQuestion.content,
            status: selectedQuestion.status
          });
          setSelected(question);
        } else {
          setSelected(undefined);
        }
      });
      return unsubscribe;
    }
  }, [ session ])

  if(!selected) return null
  return (
    <div className={clsx({
      "Vlt-black": true,
      "Vlt-bg-blue-lighter": true,
      [mStyles.root]: true
    })}>
      <Marquee 
        direction="left"
        speed={0.03}
        delay={3000}
        childMargin={160}
      >
        <b>{selected?.content}</b>
      </Marquee>
    </div>
  )
}
export default SelectedQuestion;