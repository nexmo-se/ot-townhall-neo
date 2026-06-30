// @flow
import React from "react";

import usePolling from "hooks/polling";

import CreatePoll from "../CreatePoll";
import ViewPoll from "../ViewPoll";

function ModeratorPolling(){
  const { polling } = usePolling();

  return polling ? <ViewPoll /> : <CreatePoll />;
}
export default ModeratorPolling;
