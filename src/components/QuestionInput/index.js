// @flow
import React from "react";
import useStyles from "./styles";

import TextInput from "components/TextInput";
import Button from "components/Button";

function QuestionInput(){
  const [ text, setText ] = React.useState<string>("");
  const mStyles = useStyles();
  
  function handleSendClick(){
    
  }
  
  return (
    <form className={mStyles.root}>
      <TextInput
        text={text}
        onChange={setText}
        className={mStyles.input}
      />
      <Button 
        type="submit"
        text="Send"
        onClick={handleSendClick}
        className={mStyles.button}
      />
    </form>
  );
}
export default QuestionInput;