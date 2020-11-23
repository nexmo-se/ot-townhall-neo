// @flow

import React from "react";

import useQuestion from "../../hooks/question";
import usePolling from "../../hooks/polling";
import useSession from "hooks/session";

function ResetSettings() {
  const { session } = useSession();
  const { reset: resetQuestion } = useQuestion({ sessionID: session?.id });
  const { reset: resetPolling } = usePolling({ sessionID: session?.id });

  function handleResetQuestionClick(){
    resetQuestion();
  }

  function handleResetPollingClick(){
    resetPolling();
  }

  return (
    <>
      <p>
        <strong>Reset.</strong> &nbsp;
        This action will clear the settings. Please clear based on what you want. This action cannot be undo.
      </p>

      <button 
        className="Vlt-btn Vlt-btn--app Vlt-btn--tertiary"
        onClick={handleResetQuestionClick}
      >
        Reset Questions
      </button>

      <button 
        className="Vlt-btn Vlt-btn--app Vlt-btn--tertiary"
        onClick={handleResetPollingClick}
      >
        Reset Polling
      </button>
    </>
  )
}
export default ResetSettings;