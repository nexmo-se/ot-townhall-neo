// @flow
import FetchService from "services/fetch";
import config from "config";

interface IArguments {
  sessionID: string;
}

function useQuestion({ sessionID }: IArguments){
  async function reset() {
    const url = `${config.apiURL}/questions`;
    await FetchService.delete(url, JSON.stringify({
      session_id: sessionID
    }));
  }

  return { reset }
}
export default useQuestion;