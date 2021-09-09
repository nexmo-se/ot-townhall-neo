import styles from "./SimpleInputForm.module.css";

import TextInput from "components/TextInput";
import Button from "components/Button";

function SimpleInputForm () {
  return (
    <div className={styles.inputContainer}>
      <TextInput className={styles.input} />
      <Button
        text="Send"
      />
    </div>
  )
}

export default SimpleInputForm;