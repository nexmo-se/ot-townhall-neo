// @flow
import React from "react";

import ConfigurationService from "services/configuration";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useDownload from "hooks/download";

import Icon from "components/Icon";
import Tooltip from "components/Tooltip";

interface URLParameters {
  tenant: string;
}

function ParticipantDownload () {
  // Indicate participant login type only
  const [loginType, setLoginType] = useState<string>("default");
  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const { tenant } = useParams<URLParameters>();
  const { downloadParticipantList } = useDownload({ tenant });

  async function handleDownloadClick () {
    setIsRequesting(true);
    await downloadParticipantList();
    setIsRequesting(false);
  }

  useEffect(
    () => {
      async function fetchConfiguration () {
        const configuration = await ConfigurationService.retrieve({ tenant });
        setLoginType(configuration.participant.loginType);
      }

      if (!tenant) return;
      fetchConfiguration();
    },
    [tenant]
  )
  
  if (loginType !== "ama") return null;
  else {
    return (
      <Tooltip title="Download List">
        {isRequesting? (
          <div className="Vlt-spinner Vlt-spinner--smaller" />
        ): (
          <button
            className="Vlt-btn Vlt-btn--link Vlt-btn--icon"
            onClick={handleDownloadClick}
          >
            <Icon name="Vlt-icon-download" />
          </button>
        )}
      </Tooltip>
    )
  }
}

export default ParticipantDownload;
