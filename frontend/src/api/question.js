// @flow
import config from "config";
import FetchService from "services/fetch";
import type { TStatus } from "entities/question";

import Question from "entities/question";
import User from "entities/user";

interface IMarkAs{
  sessionID: string;
  question: Question;
  status: TStatus;
}

class QuestionAPI{
  static async create(sessionID:string, question:Question){
    const url = `${config.apiURL}/questions`;
    const { id: questionID } = await FetchService.post(url, JSON.stringify({ session_id: sessionID, ...question.toRequest() }));
    const insertedQuestion = new Question({
      id: questionID,
      owner: question.owner,
      content: question.content,
      status: question.status,
      vote: 0
    });
    return insertedQuestion;
  }
  
  static async vote(sessionID:string, voter:User, question:Question){
    const url = `${config.apiURL}/questions/${question.id}/vote`;
    await FetchService.post(url, JSON.stringify({ session_id: sessionID, voter }));
  }

  static async markAs({ sessionID, question, status }: IMarkAs){
    const url = `${config.apiURL}/questions/${question.id}/mark_as`;
    await FetchService.post(url, JSON.stringify({ session_id: sessionID, status }));
  }
}
export default QuestionAPI;