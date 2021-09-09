// @flow
import React from "react";
import Papa from "papaparse";
import Config from "config";

import DownloadService from "services/download";
import ConfigurationService from "services/configuration";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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

  async function handleDownloadClick () {
    try {
      setIsRequesting(true);
      
      const url = `${Config.apiURL}/ama?tenant=${tenant}`;
      const response = await fetch(url);

      if (response.ok) {
        const jsonResponse = await response.json();
        const csvData = Papa.unparse(jsonResponse);
        const csvContent = `data:text/csv;charset=utf-8,${csvData}`;
        const downloadUrl = encodeURI(csvContent);
        const fileName = `participant_list_${tenant}`;
        DownloadService.download({
          url: downloadUrl,
          name: fileName
        });
      }
    } catch (err) {
      
    } finally {
      setIsRequesting(false);
    }
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
