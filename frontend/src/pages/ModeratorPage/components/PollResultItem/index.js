// @flow
import React from "react";
import PollingItem from "entities/polling-item";

interface IPollResultItem{ item: PollingItem }
function PollResultItem({ item }: IPollResultItem){
  return (
    <div className="Vlt-grid">
      <div className="Vlt-col">
        {item.option}
      </div>
      <div className="Vlt-col">
        &nbsp; : &nbsp; {item.count}
      </div>
    </div>
  )
}
export default PollResultItem