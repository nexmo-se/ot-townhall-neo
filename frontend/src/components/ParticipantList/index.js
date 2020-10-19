// @flow
import React from "react";
import clsx from "clsx";
import User from "entities/user";

import useStyles from "./styles";
import useSession from "hooks/session";
import ParticipantItem from "./components/ParticipantItem";

interface IParticipantList { className?: any }
function ParticipantList({ className }: IParticipantList){
  const [ participants, setParticipants ] = React.useState<Array<User>>([]);
  const { connections } = useSession();
  const mStyles = useStyles();

  function sortParticipants(a: User, b: User){
    if(a.name.toLowerCase() < b.name.toLowerCase()) return -1
    else if(a.name.toLowerCase() > b.name.toLowerCase()) return 1;
    else return 0;
  }

  React.useEffect(() => {
    const participants = connections.map((connection) => {
      const data = JSON.parse(connection.data);
      const user = User.fromJSON(data);
      user.connection = connection;
      user.id = connection.id;
      return user;
    });
    setParticipants(participants);
  }, [ connections ])

  return (
    <div className={clsx(mStyles.container, className)}>
      {participants.sort(sortParticipants).map((participant) => {
        return <ParticipantItem key={participant.id} user={participant} />
      })}
    </div>
  )
}
export default ParticipantList;