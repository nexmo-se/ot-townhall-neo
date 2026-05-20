import Question from "../entities/question";
import User from "../entities/user";
import SSEBroadcaster from "../utils/sse";
import type { TStatus } from "../entities/question";

interface IMarkAs {
  questionID: string;
  sessionID: string;
  status: TStatus;
}

interface IList {
  sessionID: string;
}

// In-memory store: sessionID -> Map<questionID, question data>
const questionStore: Map<string, Map<string, any>> = new Map();

function getSessionQuestions(sessionID: string): Map<string, any> {
  if (!questionStore.has(sessionID)) {
    questionStore.set(sessionID, new Map());
  }
  return questionStore.get(sessionID)!;
}

function broadcastQuestions(sessionID: string): void {
  const questions = getSessionQuestions(sessionID);
  const list = Array.from(questions.values())
    .map((q) => Question.fromDatabase(q))
    .map((q) => q.toResponse());
  SSEBroadcaster.broadcast(sessionID, list);
}

class QuestionAPI{
  static async create(sessionID: string, question: Question): Promise<{ id: string }>{
    const questions = getSessionQuestions(sessionID);
    const data = question.toDatabase();
    questions.set(question.id, data);
    broadcastQuestions(sessionID);
    return { id: question.id };
  }
  
  static async vote(sessionID: string, voter: User, questionID: string): Promise<void>{
    const questions = getSessionQuestions(sessionID);
    const data = questions.get(questionID);
    if (!data) return;

    const voters: any[] = data.voters || [];
    const existingIndex = voters.findIndex((v: any) => v.id === voter.id);

    if (existingIndex >= 0) {
      // Remove the vote
      voters.splice(existingIndex, 1);
      data.vote = (data.vote || 0) - 1;
    } else {
      voters.push(voter.toDatabase());
      data.vote = (data.vote || 0) + 1;
    }
    data.voters = voters;
    questions.set(questionID, data);
    broadcastQuestions(sessionID);
  }

  static async list({ sessionID }: IList): Promise<Question[]> {
    const questions = getSessionQuestions(sessionID);
    return Array.from(questions.values()).map((q) => Question.fromDatabase(q));
  }

  static async markAs({ questionID, sessionID, status }: IMarkAs): Promise<void>{
    const questions = getSessionQuestions(sessionID);
    const data = questions.get(questionID);
    if (data) {
      data.status = status;
      questions.set(questionID, data);
      broadcastQuestions(sessionID);
    }
  }
}
export default QuestionAPI;