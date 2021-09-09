import styles from "./Chat.module.css";

import Panel from "../Panel";
import Bubble from "./components/Bubble";
import SimpleInputForm from "components/SimpleInputForm"

function ChatPanel () {
  return (
    <Panel>
      <div className={styles.main}>
        <h3>Chat</h3>
        <div className={styles.bubbles}>
          <Bubble />
          <Bubble />
          <Bubble />
          <Bubble />
          <Bubble />
          <Bubble />
          <Bubble />
          <Bubble />
          <Bubble />
          <Bubble />
          <Bubble />
          <Bubble />
        </div>
        <SimpleInputForm />
      </div>
    </Panel>
  )
}

export default ChatPanel;
