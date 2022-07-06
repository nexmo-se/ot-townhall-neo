// @flow
import React from "react";

import Config from "config";
import Papa from "papaparse";
import DownloadService from "services/download";


interface UseDownloadOptions {
  tenant: string;
}

function useDownload ({ tenant }: UseDownloadOptions) {

  async function downloadParticipantList() {
    try {
        const url = `${Config.apiURL}/ama?tenant=${encodeURIComponent(tenant)}`;
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
      } catch (err) { console.log("download err:", err)}
    }
  return { downloadParticipantList }
}

export default useDownload;
