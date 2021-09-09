import React from "react";

function PollResultItem ({ item }) {
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