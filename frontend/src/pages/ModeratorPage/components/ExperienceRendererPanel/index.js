// @flow
import React from 'react';
import FetchHelper from 'helper/fetch';

import useExperienceComposer from '../../hooks/experienceComposer';
import useStyles from './styles';
import useSession from 'hooks/session';

import ExperienceRendererItem from '../ExperienceRendererItem';
import Button from 'components/Button';

function ExperienceRendererPanel() {
  const [fetching, setFetching] = React.useState<boolean>(false);
  const { session } = useSession();
  const { data, fetch } = useExperienceComposer();
  const mStyles = useStyles();

  function handleRefresh() {
    if (session) {
      FetchHelper.fetch(fetch, setFetching, { sessionID: session.id });
    }
  }

  React.useEffect(() => {
    if (session) {
      FetchHelper.fetch(fetch, setFetching, { sessionID: session.id });
    }
  }, [session, fetch]);

  return (
    <div className={mStyles.container}>
      <Button
        text="Refresh"
        className="Vlt-btn--tertiary"
        onClick={handleRefresh}
        disabled={fetching}
      />

      {data.map((experienceComposer) => (
        <ExperienceRendererItem
          key={experienceComposer.id}
          experienceComposer={experienceComposer}
        />
      ))}
    </div>
  );
}
export default ExperienceRendererPanel;
