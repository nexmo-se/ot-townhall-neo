// @flow
import React from "react";
import FetchHelper from "helper/fetch";

import useQuestion from "../../hooks/question";
import usePolling from "../../hooks/polling";
import useSession from "hooks/session";
import useMessage from "hooks/message";

interface IResetSettings {
  clear: boolean;
}

function ResetSettings({ clear }: IResetSettings) {
  const [ disabled, setDisabled ] = React.useState<boolean>(false);
  const [ status, setStatus ] = React.useState<string>("");
  const { session } = useSession();
  const { reset: resetQuestion } = useQuestion({ sessionID: session?.id });
  const { reset: resetPolling } = usePolling({ sessionID: session?.id });
  const { stopPolling: signalStopPolling } = useMessage();

  async function handleResetQuestionClick(){
    FetchHelper.fetch(resetQuestion, setDisabled, undefined, {
      done: () => setStatus("success"),
      error: () => setStatus("error")
    });
  }

  async function handleResetPollingClick(){
    FetchHelper.fetch(resetPolling, setDisabled, undefined, {
      done: () => {
        signalStopPolling();
        setStatus("success");
      },
      error: () => setStatus("error")
    });
  }

  React.useEffect(() => {
    setStatus("");
  }, [clear])

  return (
    <>
      <p>
        <strong>Reset.</strong> &nbsp;
        This action will clear the settings. Please clear based on what you want. This action cannot be undo.
      </p>

      { status === "success" && (
        <p className="Vlt-green">
          <strong>Reset complete!</strong>
        </p>
      )}

      { status === "error" && (
        <p className="Vlt-red">
          <strong>Reset failed!</strong>
        </p>
      )}

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