// @flow
import React from "react";
import FetchService from "services/fetch";
import Recording from "entities/recording";
import config from "config";

interface IFetch {
  sessionID: string;
}

interface IRetrieve {
  id: string;
}

function useRecording(){
  const [ data, setData ] = React.useState<Recording[]>([]);

  const fetch = React.useCallback(async ({ sessionID }: IFetch) => {
    const url = `${config.apiURL}/recordings?session_id=${sessionID}`;
    const response = await FetchService.get(url);
    const recordings = response.map((res) => Recording.fromResponse(res));
    setData(recordings);
  }, []);

  const retrieve = React.useCallback(async ({ id }: IRetrieve) => {
    const url = `${config.apiURL}/recordings/${id}`;
    const response = await FetchService.get(url);
    return Recording.fromResponse(response);
  }, [])

  return { fetch, retrieve, data }
}
export default useRecording;