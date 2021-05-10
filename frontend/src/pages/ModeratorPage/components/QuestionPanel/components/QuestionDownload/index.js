// @flow
import styles from "./QuestionDownload.module.css";

import React from "react";
import Papa from "papaparse";
import Firestore from "utils/firestore";
import DownloadService from "services/download";
import lodash from "lodash";
import clsx from "clsx";
import useSession from "hooks/session";
import { DateTime } from "luxon";

import Icon from "components/Icon";

function QuestionDownload () {
  const [hasQuestions, setHasQuestions] = React.useState<boolean>(false);
  const { session } = useSession();

  const retrieveQuestions = React.useCallback(
    async () => {
      const convertFirebase = (doc) => {
        const data = lodash(doc.data())
        return ({
          owner_name: data.get("owner.name"),
          content: data.get("content"),
          vote: data.get("vote"),
          status: data.get("status"),
          created_at: DateTime.fromSeconds(parseInt(data.get("created_at")))
        })
      }

      const db = Firestore.getInstance();
      const sessionId = lodash(session).get("sessionId");
      const querySnapshot = await db.collection(`questions_${sessionId}`).get();
      const data = lodash(querySnapshot.docs).map(convertFirebase).value();
      return data;
    },
    [session]
  )

  /**
   * Retrieve questions data and then parse it to CSV 
   * using Papaparse library. After that download it directly
   * using `a` tag
   */
  async function handleDownload () {
    const sessionId = lodash(session).get("sessionId");
    const data = await retrieveQuestions();
    const csvData = Papa.unparse(data);
    const csvContent = `data:text/csv;charset=utf-8,${csvData}`;
    const downloadUrl = encodeURI(csvContent);
    const fileName = `questions_${sessionId}`
    DownloadService.download({
      url: downloadUrl,
      name: fileName
    });
  }

  React.useEffect(
    () => {
      async function doSomething () {
        const questions = await retrieveQuestions()
        if (questions && questions.length > 0) {
          setHasQuestions(true);
        } else {
          setHasQuestions(false);
        }
      }
      doSomething();
    },
    [retrieveQuestions]
  )

  if (!hasQuestions) return null
  else {
    return (
      <div
        onClick={handleDownload}
        className={
          clsx(
            "Vlt-text-link",
            styles.container
          )
        }
      >
        <Icon
          className={
            clsx(
              "Vlt-purple",
              styles.margin_right
            )
          }
          name="Vlt-icon-download"
        />
        <span>Download as CSV</span>
      </div>
    )
  }
}

export default QuestionDownload;
