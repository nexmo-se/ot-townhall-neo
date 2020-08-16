// @flow
import React from "react";
import clsx from "clsx";
import QuestionAPI from "api/question";

import User from "entities/user";
import Question from "entities/question";

import useStyles from "./styles";
import useMe from "hooks/me";
import useSession from "hooks/session";

import Icon from "components/Icon";

type Props = { question: Question };

function Vote({ question }:Props){
  const [ voted, setVoted ] = React.useState<boolean>(false);
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
  
  React.useEffect(() => {
    const { connection } = mSession.session;
    const { connectionId: connectionID } = connection;
    const foundMe = question.voters.find((voter) => voter.id === connectionID);
    if(foundMe) setVoted(true);
    else setVoted(false);
  }, [ question.voters ])
  
  return (
    <div 
      className={clsx({
        [mStyles.voteContainer]: true,
        "Vlt-bg-purple-dark": voted,
        "Vlt-white": voted
      })}
      onClick={handleVote}
    >
      <Icon name="Vlt-icon-up" />
      <p 
        className={clsx({
          "Vlt-white": voted    
        })}
      >
        {question.vote}
      </p>
      <span>Vote</span>
    </div>
  )
}
export default Vote;