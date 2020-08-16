// @flow
import React from "react";
import QuestionAPI from "api/question";

import User from "entities/user";
import Question from "entities/question";

import useStyles from "./styles";
import useMe from "hooks/me";
import useSession from "hooks/session";

import Icon from "components/Icon";

type Props = { question: Question };

function Vote({ question }:Props){
  const mStyles = useStyles();
  const mSession = useSession();
  const mMe = useMe();
  
  async function handleVote(){
    const { connection, sessionId: sessionID } = mSession.session;
    const voter = new User();
    voter.id = connection.connectionId;
    voter.name = mMe.me.name;
    voter.role = mMe.me.role;
    
    await QuestionAPI.vote(sessionID, voter, question);
  }
  
  return (
    <div 
      className={mStyles.voteContainer}
      onClick={handleVote}
    >
      <Icon name="Vlt-icon-up" />
      <p>{question.vote}</p>
      <span>Vote</span>
    </div>
  )
}
export default Vote;