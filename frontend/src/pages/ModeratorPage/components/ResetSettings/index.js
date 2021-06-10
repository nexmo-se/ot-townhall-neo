// @flow
import React from "react";
import FetchHelper from "helper/fetch";
import Config from "config";

import useQuestion from "../../hooks/question";
import usePolling from "../../hooks/polling";
import useSession from "hooks/session";
import useMessage from "hooks/message";
import { useParams } from "react-router-dom";

interface IResetSettings {
  clear: boolean;
}

interface URLParameters {
  tenant: string;
}

function ResetSettings({ clear }: IResetSettings) {
  const [ disabled, setDisabled ] = React.useState<boolean>(false);
  const [ status, setStatus ] = React.useState<string>("");
  const { session } = useSession();
  const { tenant } = useParams<URLParameters>();
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

  async function handleResetParticipantsClick () {
    const resetParticipants = async () => {
      const url = `${Config.apiURL}/ama`
      const body = { tenant };
      await fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
    }

    FetchHelper.fetch(resetParticipants, setDisabled, undefined, {
      done: () => setStatus("success"),
      error: () => setStatus("error")
    })
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

      <button 
        className="Vlt-btn Vlt-btn--app Vlt-btn--tertiary"
        onClick={handleResetParticipantsClick}
        disabled={disabled}
      >
        Reset Participants
      </button>
    </>
  )
}
export default ResetSettings;