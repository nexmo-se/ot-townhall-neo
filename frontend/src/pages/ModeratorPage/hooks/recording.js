// @flow
import React from "react";
import FetchService from "services/fetch";
import Recording from "entities/recording";
import config from "config";

interface IFetch {
  sessionID: string;
}

function useRecording(){
  const [ data, setData ] = React.useState<Recording[]>([]);

  const fetch = React.useCallback(async ({ sessionID }: IFetch) => {
    const url = `${config.apiURL}/recordings?session_id=${sessionID}`;
    const response = await FetchService.get(url);
    const recordings = response.map((res) => Recording.fromResponse(res));
    setData(recordings);
  }, []);

  return { fetch, data }
}
export default useRecording;