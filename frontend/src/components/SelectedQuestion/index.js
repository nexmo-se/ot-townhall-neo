// @flow
import React from "react";
import Firestore from "utils/firestore";
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
    if(session){
      const db = Firestore.getInstance();
      db.collection(`questions_${session.id}`).onSnapshot((querySnapshot) => {
        const [ question ] = querySnapshot.docs.map((documentSnapshot) => {
          const data = documentSnapshot.data();
          const question = new Question({
            id: documentSnapshot.id,
            owner:  new User({ 
              id: data.owner.id,
              name: data.owner.name, 
              role: data.owner.role 
            }),
            content: data.content,
            status: data.status
          })
          return question;
        }).filter((question) => question.status === "selected");
        setSelected(question);
      })
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
        speed={0.06}
        delay={3000}
        childMargin={160}
      >
        <b>{selected?.content}</b>
      </Marquee>
    </div>
  )
}
export default SelectedQuestion;