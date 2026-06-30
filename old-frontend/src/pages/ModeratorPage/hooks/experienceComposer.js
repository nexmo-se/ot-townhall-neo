// @flow
import React from 'react';
import FetchService from 'services/fetch';
import experienceComposerEntity from 'entities/experienceComposer';
import config from 'config';
import { useParams } from 'react-router-dom';

interface IFetch {
  sessionID: string;
}

interface IRetrieve {
  id: string;
}

interface IParam {
  tenant: string;
}

function useExperienceComposer() {
  const [data, setData] = React.useState<experienceComposerEntity[]>([]);
  const { tenant } = useParams<IParam>();

  const fetch = React.useCallback(
    async ({ sessionID }: IFetch) => {
      let apiURL = config.apiURL;
      const url = `${apiURL}/renderer/${tenant}?sessionId=${sessionID}`;
      const response = await FetchService.get(url);
      const recordings = response.map((res) =>
        experienceComposerEntity.fromResponse(res)
      );
      setData(recordings);
    },
    [tenant]
  );

  /**
   * Retrieve based on Renderer ID
   */
  const retrieve = React.useCallback(async ({ id }: IRetrieve) => {
    throw new Error('NOT IMPLEMENTED');
    let apiURL = config.apiURL;
    const url = `${apiURL}/renderer/${id}`;
    const response = await FetchService.get(url);
    return experienceComposerEntity.fromResponse(response);
  }, []);

  return { fetch, retrieve, data };
}
export default useExperienceComposer;
