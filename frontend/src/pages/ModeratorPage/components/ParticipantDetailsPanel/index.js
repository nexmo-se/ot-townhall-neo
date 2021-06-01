// @flow
import React from "react";
import Config from "config";
import Papa from "papaparse";
import DownloadService from "services/download";
import { useParams } from "react-router-dom";

import SettingsModal from "../SettingsModal";
import SettingsProvider from "../SettingsProvider";
import Button from "components/Button";

interface IParams {
  tenant: string;
}

function ParticipantDetailsPanel () {
  const { tenant } = useParams<IParams>();

  async function handleResetClick () {
    // Call the API
    const url = `${Config.apiURL}/ama`;
    const body = { tenant };
    const response = await fetch(url, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
  }

  async function handleDownloadClick () {
    const url = `${Config.apiURL}/ama`;
    const body = { tenant };
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

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
  }

  return (
    <>
      <p>Only able to download the participant details when you are using <code>Customer Details</code> login type</p>
      <div style={{ display: "flex" }}>
        <Button
          className="Vlt-btn--primary Vlt-btn--app"
          text="Download Details"
          onClick={handleDownloadClick}
        />
        <Button
          className="Vlt-btn--app Vlt-btn--tertiary"
          text="Reset"
          onClick={handleResetClick}
        />
      </div>
    </>
  )
}
export default ParticipantDetailsPanel;