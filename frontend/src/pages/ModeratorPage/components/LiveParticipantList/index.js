// @flow
import React from "react";
import User from "entities/user";
import type { Node } from "react"

import useStyles from "./styles";
import useSession from "hooks/session";

import LiveParticipantItem from "../LiveParticipantItem";
import RemoteSlidesButton from "./components/RemoteSlidesButton";

interface ILiveParticipantList { children?: Node }
function LiveParticipantList({ children }: ILiveParticipantList){
  const [ participants, setParticipants ] = React.useState<Array<User>>([]);
  const { subscribers } = useSession();
  const mStyles = useStyles();

  function sortParticipants(a: User, b: User){
    if(a.name.toLowerCase() < b.name.toLowerCase()) return -1;
    else if(a.name.toLowerCase() > b.name.toLowerCase()) return 1;
    else return 0;
  }

  React.useEffect(() => {
    const participants = subscribers.filter((subscriber) => {
      if(subscriber.stream.videoType === "screen") return false;
      else return true;
    }).map((subscriber) => {
      const { connection } = subscriber.stream;
      const user = User.fromConnection(connection);
      user.subscriber = subscriber;
      return user;
    })
    setParticipants(participants);
  }, [subscribers]);

  return (
    <div className={mStyles.container}>
      {children}
      {participants.sort(sortParticipants).map((participant) => {
        return (
          <LiveParticipantItem 
            key={participant.id}
            user={participant} 
            subscriber={participant.subscriber}
            withAvatar
            additionalControls={(
              <>
                { participant.subscriber && (
                  <RemoteSlidesButton
                    size={32}
                    style={{ marginRight: 8 }}
                    user={participant}
                  />
                )}
              </>
            )}
          />
        )
      })}
    </div>
  )
}
export default LiveParticipantList;