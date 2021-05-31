// @flow
import React from "react";
import useStyles from "./styles";

function ThankYouPage () {
  const mStyles = useStyles();

  return (
    <div className={mStyles.container}>
      <div className="Vlt-card">
        <div className="Vlt-card__content">
          <h1>Thank you for using Vonage Townhall</h1>
        </div>
      </div>
    </div>
  )
}

export default ThankYouPage;
