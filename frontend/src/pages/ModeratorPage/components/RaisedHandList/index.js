// @flow
import React from "react";
import User from "entities/user";

import useStyles from "./styles";
import useMessage from "hooks/message";
import { useState, useEffect } from "react";

import RaisedHandItem from "../RaisedHandItem";

function ParticipantList () {
  const [participants, setParticipants] = useState<Array<User>>([]);
  const { raisedHands } = useMessage();
  const mStyles = useStyles();

  useEffect(
    () => {
      setParticipants(raisedHands)
    },
    [raisedHands]
  )

  return (
    <div className={mStyles.container}>
      {
        participants.map(
          (participant) => {
            return (
              <RaisedHandItem
                user={participant}
              />
            )
          }
        )
      }
    </div>
  )
}
export default ParticipantList;