import styles from "./Questions.module.css";
import Panel from "../Panel";
import QuestionItem from "../../../QuestionItem";
import SimpleInputForm from "components/SimpleInputForm";

function Questions () {
  return (
    <Panel>
      <div className={styles.main}>
        <h3>Questions (3)</h3>
        <div className={styles.questionList}>
          <QuestionItem selected />
          <QuestionItem voted />
          <QuestionItem />
          <QuestionItem />
          <QuestionItem />
          <QuestionItem />
          <QuestionItem />
          <QuestionItem />
          <QuestionItem />
          <QuestionItem />
          <QuestionItem />
          <QuestionItem />
          <QuestionItem />
          <QuestionItem />
          <QuestionItem />
          <QuestionItem />
          <QuestionItem />
          <QuestionItem />
          <QuestionItem />
          <QuestionItem />
          <QuestionItem />
          <QuestionItem />
          <QuestionItem />
          <QuestionItem />
          <QuestionItem />
        </div>
        <SimpleInputForm />
      </div>                                  
    </Panel>
  );
}

export default Questions;
