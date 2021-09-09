import styles from "./Bubble.module.css";
import stc from "string-to-color";
import MarkdownService from "services/markdown";

function Bubble () {

  function renderChat () {
    const md = MarkdownService.getInstance();
    return md.render("*This is italic text* _This is italic text_ ~~Strikethrough~~");
  }

  return (
    <div className={styles.main}>
      <div className={styles.sender}>
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            marginRight: 4,
            backgroundColor: stc("Frans Siswanto")
          }}
        >
          &nbsp;
        </span>
        <span>
          <strong className="Vlt-purple-dark">
            Frans Siswanto
          </strong>
        </span>
        <span className="Vlt-grey-dark">
          <small>
            11:45AM
          </small>
        </span>
      </div>
      <span dangerouslySetInnerHTML={{ __html: renderChat() }} />
    </div>
  )
}

export default Bubble;
