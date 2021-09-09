import styles from "./QuestionItem.module.css";

import clsx from "clsx";
import MarkdownService from "services/markdown";

import Icon from "components/Icon";

function QuestionItem ({ selected, voted }) {

  function renderChat () {
    const md = MarkdownService.getInstance();
    return md.render("*This is italic text* _This is italic text_ ~~Strikethrough~~");
  }

  return (
    <div className={styles.main}>
      <div
        className={
          clsx({
            [styles.voteContainer]: true,
            [styles.voted]: voted
          })
        }
      >
        <Icon
          name="Vlt-icon-up"
          className={
            clsx({ "Vlt-white": voted })
          }
        />
        <span>0</span>
        <span>Vote</span>
      </div>
      <div className={styles.content}>
        <div className={styles.questionContent}>
          <p>
            <strong>Frans Siswanto</strong>
          </p>
          <span dangerouslySetInnerHTML={{ __html: renderChat() }} />
        </div>
        <div className={styles.actions}>
          <span className={styles.action}>
            Mark as Answered
          </span>
          {
            !selected && (
              <span className={styles.action}>
                Select
              </span>
            )
          }
        </div>
      </div>
    </div>
  );
}

export default QuestionItem;
