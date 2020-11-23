// @flow
import React from "react";
import FetchHelper from "helper/fetch";

import useQuestion from "../../hooks/question";
import usePolling from "../../hooks/polling";
import useSession from "hooks/session";

function ResetSettings() {
  const [ disabled, setDisabled ] = React.useState<boolean>(false);
  const { session } = useSession();
  const { reset: resetQuestion } = useQuestion({ sessionID: session?.id });
  const { reset: resetPolling } = usePolling({ sessionID: session?.id });

  async function handleResetQuestionClick(){
    FetchHelper.fetch(resetQuestion, setDisabled);
  }

  async function handleResetPollingClick(){
    FetchHelper.fetch(resetPolling, setDisabled);
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
        disabled={disabled}
      >
        Reset Questions
      </button>

      <button 
        className="Vlt-btn Vlt-btn--app Vlt-btn--tertiary"
        onClick={handleResetPollingClick}
        disabled={disabled}
      >
        Reset Polling
      </button>
    </>
  )
}
export default ResetSettings;