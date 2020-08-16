// @flow
import config from "config";
import Question from "entities/question";
import User from "entities/user";

class QuestionAPI{
  static async create(sessionID:string, question:Question){
    const response = await fetch(`${config.apiURL}/questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionID, ...question.toRequest() })
    });
    if(response.ok){
      const { id: questionID } = await response.json();
      const insertedQuestion = new Question({
        id: questionID,
        owner: question.owner,
        content: question.content,
        vote: 0
      });
      return insertedQuestion;
    }else throw new Error(response.statusText);
  }
  
  static async vote(sessionID:string, voter:User, question:Question){
    const response = await fetch(`${config.apiURL}/questions/${question.id}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionID, voter })
    });
    if(response.ok) return;
    else throw new Error(response.statusText);
  }
}
export default QuestionAPI;