// @flow
import FetchService from "services/fetch";
import config from "config";

interface IArguments {
  sessionID: string;
}

function usePolling({ sessionID }: IArguments){
  async function reset() {
    const url = `${config.apiURL}/pollings?session_id=${sessionID}`;
    await FetchService.delete(url);
  }

  return { reset }
}
export default usePolling;