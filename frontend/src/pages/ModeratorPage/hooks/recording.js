// @flow
import React from "react";
import Recording from "entities/recording";
import { v4 as uuid } from "uuid";

function useRecording(){
  const [ data, setData ] = React.useState<Recording[]>([]);

  const fetch = React.useCallback(async () => {
    setData([
      new Recording({
        id: uuid(),
        duration: 2144,
        createdAt: 1605702496000,
        status: "available"
      }),
      new Recording({
        id: uuid(),
        duration: 2144,
        createdAt: 1605702496000,
        status: "available"
      }),
      new Recording({
        id: uuid(),
        duration: 2144,
        createdAt: 1605702496000,
        status: "expired"
      }),
      new Recording({
        id: uuid(),
        duration: 2144,
        createdAt: 1605702496000,
        status: "expired"
      })
    ])
  }, []);

  return { fetch, data }
}
export default useRecording;