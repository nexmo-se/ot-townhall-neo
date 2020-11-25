// @flow
import React from "react";
import QuestionAPI from "api/question";

import Question from "entities/question";
import User from "entities/user";

import useStyles from "./styles";
import useSession from "hooks/session";
import useMe from "hooks/me";

import TextInput from "components/TextInput";
import Button from "components/Button";

function QuestionInput(){
  const [ sending, setSending ] = React.useState<boolean>(false);
  const [ text, setText ] = React.useState<string>("");
  const mStyles = useStyles();
  const mSession = useSession();
  const mMe = useMe();
  
  async function handleSubmit(e){
    e.preventDefault();
    setSending(true);
    if(!mMe.me) throw new Error("Ops!");
    const { sessionId: sessionID, connection } = mSession.session;
    const question = new Question({
      owner: new User({
        id: connection.connectionId,
        name: mMe.me.name,
        role: mMe.me.role
      }),
      content: text
    })
    await QuestionAPI.create(sessionID, question);
    setText("");
    setSending(false);
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
        disabled={sending}
      />
    </form>
  );
}
export default QuestionInput;