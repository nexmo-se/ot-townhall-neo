// @flow
import React from 'react';
import FetchHelper from 'helper/fetch';
import DownloadService from 'services/download';
import experienceComposer from 'entities/experienceComposer';
import { DateTime } from 'luxon';

import useStyles from './styles';
import useRecording from '../../hooks/experienceComposer';

import Icon from 'components/Icon';

import Tooltip from 'components/Tooltip';

interface IExperienceRendererItem {
  experienceComposer: experienceComposer;
}

function ExperienceRendererItem({
  experienceComposer
}: IExperienceRendererItem) {
  const [fetching, setFetching] = React.useState<boolean>(false);
  const { retrieve } = useRecording();
  const mStyles = useStyles();

  async function handleDownload() {
    // todo to remove
    // const foundRecording = await FetchHelper.fetch(retrieve, setFetching, { id: experienceComposer.id });

    if (experienceComposer && experienceComposer.url) {
      DownloadService.download({
        url: experienceComposer.url
      });
    }
  }

  return (
    <div className={mStyles.container}>
      <div className={mStyles.left}>
        <h5 className={mStyles.title}>{experienceComposer.id.split('-')[0]}</h5>
        <p>
          {experienceComposer.createdAt?.toLocaleString(DateTime.DATETIME_MED)}
        </p>
      </div>
      <div className={mStyles.right}>
        {experienceComposer.status === 'available' && (
          <Tooltip title="Play Recording">
            <button
              className="Vlt-btn Vlt-btn--primary Vlt-btn--icon Vlt-btn--app"
              onClick={handleDownload}
              disabled={fetching}
            >
              <Icon name="Vlt-icon-download-full" />
            </button>
          </Tooltip>
        )}
      </div>
    </div>
  );
}
export default ExperienceRendererItem;
