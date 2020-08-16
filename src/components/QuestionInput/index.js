// @flow
import React from "react";
import Question from "entities/question";
import QuestionAPI from "api/question";

import useStyles from "./styles";
import useSession from "hooks/session";
import useMe from "hooks/me";

import TextInput from "components/TextInput";
import Button from "components/Button";

function QuestionInput(){
  const [ text, setText ] = React.useState<string>("");
  const mStyles = useStyles();
  const mSession = useSession();
  const mMe = useMe();
  
  async function handleSubmit(e){
    e.preventDefault();
    const { sessionId: sessionID, connection } = mSession.session;
    const question = new Question({
      owner: {
        id: connection.connectionId,
        name: mMe.me.name,
        role: mMe.me.role
      },
      content: text
    })
    await QuestionAPI.create(sessionID, question);
  }
  
  return (
    <form className={mStyles.root} onSubmit={handleSubmit}>
      <TextInput
        text={text}
        onChange={setText}
        className={mStyles.input}
      />
      <Button 
        type="submit"
        text="Send"
        onClick={handleSubmit}
        className={mStyles.button}
      />
    </form>
  );
}
export default QuestionInput;