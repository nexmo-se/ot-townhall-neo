import { useParams, useHistory } from "react-router";

function OpenedRoom () {
  const { tenant } = useParams();
  const { push } = useHistory();

  function handleClick () {
    push(`/${tenant}/participant`)
  }

  return (
    <>
      <h1>
        Room is Open!
      </h1>
      <p>
        The Moderator has opened the room.
      </p>
      <button
        className="Vlt-btn Vlt-btn--app Vlt-btn--secondary"
        onClick={handleClick}
      >
        Enter Now!
      </button>
    </>
  )
}

export default OpenedRoom;
