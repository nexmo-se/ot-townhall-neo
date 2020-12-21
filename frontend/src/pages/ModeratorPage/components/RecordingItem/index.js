// @flow
import React from "react";
import FetchHelper from "helper/fetch";
import DownloadService from "services/download";
import Recording from "entities/recording";
import clsx from "clsx";
import { DateTime } from "luxon";

import useStyles from "./styles";
import useRecording from "../../hooks/recording";

import Icon from "components/Icon";

interface IRecordingItem {
  recording: Recording;
}

function RecordingItem({ recording }: IRecordingItem){
  const [ fetching, setFetching ] = React.useState<boolean>(false);
  const { retrieve } = useRecording();
  const mStyles = useStyles();

  async function handleDownload() {
    const foundRecording = await FetchHelper.fetch(retrieve, setFetching, { id: recording.id });

    if (foundRecording) {
      DownloadService.download({
        url: foundRecording.url
      });
    }
  }

  return (
    <div className={mStyles.container}>
      <div className={mStyles.left}>
        <h5 className={mStyles.title}>
          {recording.id.split("-")[0]}
        </h5>
        <p>
          {
            recording.createdAt?.toLocaleString(DateTime.DATETIME_MED)
          }
        </p>
      </div>
      <div className={mStyles.right}>
        <p 
          className={clsx({
            "p-large": true,
            [mStyles.time]: true,
            [mStyles.noMarginRight]: recording.status !== "available"
          })}
        >
          {
            recording.duration?.toFormat("h:m:s")
          }
        </p>
        { recording.status === "available" && (
          <button
            className="Vlt-btn Vlt-btn--primary Vlt-btn--icon Vlt-btn--app"
            onClick={handleDownload}
            disabled={fetching}
          >
            <Icon name="Vlt-icon-download-full" />
          </button>
        )}
      </div>
    </div>
  )
}
export default RecordingItem;