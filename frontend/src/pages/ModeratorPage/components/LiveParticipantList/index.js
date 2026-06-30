// @flow
import React from "react";
import User from "entities/user";
import type { Node } from "react";

import useStyles from "./styles";
import useSession from "hooks/session";
import { useState, useEffect } from "react";

import LiveParticipantItem from "../LiveParticipantItem";
import InfoDialog from "components/InfoDialog";

interface LiveParticipantListProps {
  children?: Node
}

function LiveParticipantList ({ children }: LiveParticipantListProps) {
  const [participants, setParticipants] = useState<User[]>([]);
  const [forbiddenDialogOpen, setForbiddenDialogOpen] = useState<boolean>(false);
  const { subscribers } = useSession();
  const mStyles = useStyles();

  function sortParticipants (a: User, b: User) {
    if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
    else if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
    else return 0;
  }

  function handleForbidden () {
    setForbiddenDialogOpen(true);
  }

  useEffect(
    () => {
      const participants = subscribers.filter(
        (subscriber) => {
          if (subscriber.stream.videoType === "screen") return false;
          else return true;
        }
      ).map(
        (subscriber) => {
          const { connection } = subscriber.stream;
          const user = User.fromConnection(connection);
          user.subscriber = subscriber;
          return user;
        }
      )
      setParticipants(participants);
    },
    [subscribers]
  );

  return (
    <div className={mStyles.container}>
      {children}
      {
        participants.sort(sortParticipants).map(
          (participant) => {
            return (
              <LiveParticipantItem 
                key={participant.id}
                user={participant}
                subscriber={participant.subscriber}
                onForbidden={handleForbidden}
                withAvatar
              />
            )
          }
        )
      }
      <InfoDialog
        id="forbidden-dialog"
        title="Forbidden"
        visible={forbiddenDialogOpen}
        setVisible={setForbiddenDialogOpen}
      >
        <p>
          As Moderator, you are not allowed to turn the audio/video on for
          live participant or presenter. 
        </p>

        <p>
          However, you are allowed to turn it off.
        </p>
      </InfoDialog>
    </div>
  )
}
export default LiveParticipantList;