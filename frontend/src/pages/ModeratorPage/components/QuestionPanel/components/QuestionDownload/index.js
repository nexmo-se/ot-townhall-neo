// @flow
import styles from "./QuestionDownload.module.css";

import React from "react";
import Papa from "papaparse";
import QuestionStream from "utils/firestore";
import DownloadService from "services/download";
import lodash from "lodash";
import clsx from "clsx";
import { DateTime } from "luxon";

import useSession from "hooks/session";
import useMessage from "hooks/message";

import Icon from "components/Icon";
import Modal from "components/Modal";
import Button from "components/Button";
import { Portal } from "@material-ui/core";

function QuestionDownload () {
  const [hasQuestions, setHasQuestions] = React.useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const { session } = useSession();
  const { modalContainer } = useMessage();

  /**
   * Retrieve the questions from the backend REST API.
   * It will retrieve for every status.
   */
  const retrieveQuestions = React.useCallback(
    async () => {
      const sessionId = lodash(session).get("sessionId");
      if (!sessionId) return [];
      const data = await QuestionStream.fetchQuestions(sessionId);
      return data.map((item) => ({
        owner_name: lodash(item).get("owner.name"),
        content: lodash(item).get("content"),
        vote: lodash(item).get("vote"),
        status: lodash(item).get("status"),
        created_at: DateTime.fromSeconds(parseInt(lodash(item).get("created_at")))
      }));
    },
    [session]
  )

  async function handleRefresh () {
    window.location.reload();
  }

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
    toggleModal();
  }

  function toggleModal () {
    setIsModalOpen(
      (old: boolean) => {
        return !old
      }
    )
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

  if (!hasQuestions) {
    return (
      <span>
        Missing download button? Please &nbsp;
        <span
          className="Vlt-text-link"
          onClick={handleRefresh}
        >
          refresh
        </span>
        &nbsp; the page
      </span>
    )
  } else {
    return (
      <>
        <div
          onClick={toggleModal}
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
        <Portal container={modalContainer.current}>
          <Modal
            id="download-questions"
            open={isModalOpen}
          >
            <Modal.Header>
              <h3>Do you want to download questions?</h3>
            </Modal.Header>
            <Modal.Content>
              <p>
                You will download every single questions as csv including the one that is
                not shown in the UI (eg. answered/deleted). 
              </p>
            </Modal.Content>
            <Modal.Footer>
              <Button
                text="Cancel"
                className="Vlt-btn--tertiary"
                onClick={toggleModal}
              />
              <Button
                text="Download"
                className="Vlt-btn--secondary"
                onClick={handleDownload}
              />
            </Modal.Footer>
          </Modal>
        </Portal>
      </>
    )
  }
}

export default QuestionDownload;
