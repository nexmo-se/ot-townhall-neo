// @flow
import React from "react";
import User from "entities/user";

import useStyles from "./styles";
import useMessage from "hooks/message";

import Avatar from "components/Avatar";

interface RaisedHandItemProps {
  user: User
}

function RaisedHandItem ({ user }: RaisedHandItemProps) {
  const { approveGoLive, declineGoLive, removeRaisedHand } = useMessage();
  const mStyles = useStyles();

  async function handleApproveClick () {
    await approveGoLive({ user });
    removeRaisedHand(user);
  }

  async function handleDeclineClick () {
    await declineGoLive({ user });
    removeRaisedHand(user);
  }

  return (
    <div
      className="Vlt-card Vlt-card--plain Vlt-bg-aqua-lighter Vlt-card--lesspadding"
      style={{ marginTop: 8, marginBottom: 4 }}
    >
      <div
        className="Vlt-card__content"
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <Avatar
          user={user}
          size={50}
          className={mStyles.avatar}
        />
        <div
          style={{ display: "flex", flexDirection: "column", maxWidth: 200  }}
        >
          <p>
            <b>{user.name}</b>
          </p>
          <div>
            <button
              className="Vlt-btn Vlt-btn--tertiary Vlt-btn--app"
              onClick={handleDeclineClick}
            >
              Decline
            </button>
            <button
              className="Vlt-btn Vlt-btn--secondary Vlt-btn--app"
              onClick={handleApproveClick}
            >
              Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default RaisedHandItem;