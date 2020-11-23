// @flow
import React from "react";
import Recording from "entities/recording";
import useStyles from "./styles";
import clsx from "clsx";
import { DateTime } from "luxon";

import Icon from "components/Icon";

interface IRecordingItem {
  recording: Recording;
}

function RecordingItem({ recording }: IRecordingItem){
  const mStyles = useStyles();

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
          <a 
            href={recording.url}
            target="_blank"
            className="Vlt-btn Vlt-btn--primary Vlt-btn--icon Vlt-btn--app"
          >
            <Icon name="Vlt-icon-download-full" />
          </a>
        )}
      </div>
    </div>
  )
}
export default RecordingItem;