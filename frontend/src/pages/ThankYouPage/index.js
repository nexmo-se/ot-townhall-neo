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
          <p>We hope you enjoy it. If you have any feedback, you can email me at frans.siswanto@vonage.com or go to Slack #ask-cse-townhall</p>
        </div>
      </div>
    </div>
  )
}

export default ThankYouPage;
