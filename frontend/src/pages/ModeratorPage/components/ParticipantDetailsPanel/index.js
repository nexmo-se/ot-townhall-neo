// @flow
import React from "react";
import Config from "config";
import Papa from "papaparse";
import DownloadService from "services/download";

import { useParams } from "react-router-dom";
import { useState } from "react";

import Button from "components/Button";

interface IParams {
  tenant: string;
}

function ParticipantDetailsPanel () {
  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const { tenant } = useParams<IParams>();

  async function handleResetClick () {
    try {
      setIsRequesting(true);

      // Call the API
      const url = `${Config.apiURL}/ama`;
      const body = { tenant };
      await fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
    } catch (err) {
      console.log(err);
    } finally {
      setIsRequesting(false);
    }
  }

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
      console.log(err);
    } finally {
      setIsRequesting(false);
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
          disabled={isRequesting}
        />
        <Button
          className="Vlt-btn--app Vlt-btn--tertiary"
          text="Reset"
          onClick={handleResetClick}
          disabled={isRequesting}
        />
      </div>
    </>
  )
}
export default ParticipantDetailsPanel;