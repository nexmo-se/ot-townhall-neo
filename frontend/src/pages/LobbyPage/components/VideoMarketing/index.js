import React from "react";

function VideoMarketing (props) {
  const { lobbySource } = props;
  const extension = lobbySource.split('.').pop();

  if (extension === "mp4") {
    return (
      <video autoPlay loop>
        <source
          src={lobbySource}
          type="video/mp4"
        />
      </video>
    )
  }
  else {
    return (
      <figure>
        <img src={lobbySource}></img>
      </figure>
    )
  }
}

export default VideoMarketing;
