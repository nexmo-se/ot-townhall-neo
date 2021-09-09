import React from "react";
import clsx from "clsx";
import QuestionAPI from "api/question";
import User from "entities/user";

import useStyles from "./styles";
import useSession from "hooks/session";
import { useMe } from "components/MeProvider";

import Icon from "components/Icon";

function Vote({ question }){
  const [ voted, setVoted ] = React.useState(false);
  const mStyles = useStyles();
  const mSession = useSession();
  const mMe = useMe();
  
  async function handleVote(){
    if(!mMe.me) throw new Error("Ops!");
    const { connection, sessionId: sessionID } = mSession.session;
    const voter = new User({ name: mMe.me.name, role: mMe.me.role });
    voter.id = connection.connectionId;
    
    await QuestionAPI.vote(sessionID, voter, question);
  }
  
  React.useEffect(() => {
    const { connection } = mSession.session;
    const { connectionId: connectionID } = connection;
    const foundMe = question.voters.find((voter) => voter.id === connectionID);
    if(foundMe) setVoted(true);
    else setVoted(false);
  }, [ question.voters, mSession.session ])
  
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