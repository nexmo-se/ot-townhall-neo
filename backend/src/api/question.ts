import Question from "../entities/question";
import User from "../entities/user";
import SSEBroadcaster from "../utils/sse";
import type { TStatus } from "../entities/question";
import MongoDBStore from "./database";

interface IMarkAs {
  questionID: string;
  sessionID: string;
  status: TStatus;
}

interface IList {
  sessionID: string;
}

async function broadcastQuestions(sessionID: string): Promise<void> {
  console.log(`[broadcastQuestions] Broadcasting questions for session ${sessionID}`);
  const questions = await MongoDBStore.questions()
    .find({ session_id: sessionID })
    .toArray();
  console.log(`[broadcastQuestions] Found ${questions.length} questions`);
  const list = questions
    .map((q: any) => Question.fromDatabase(q))
    .map((q: Question) => q.toResponse());
  console.log(`[broadcastQuestions] Sending broadcast with ${list.length} questions`);
  SSEBroadcaster.broadcast(sessionID, list);
}

class QuestionAPI{
  static async create(sessionID: string, question: Question): Promise<{ id: string }>{
    const data = {
      ...question.toDatabase(),
      session_id: sessionID
    };
    await MongoDBStore.questions().insertOne(data);
    await broadcastQuestions(sessionID);
    return { id: question.id };
  }
  
  static async vote(sessionID: string, voter: User, questionID: string): Promise<void>{
    const data = await MongoDBStore.questions().findOne({
      session_id: sessionID,
      id: questionID
    });
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

    await MongoDBStore.questions().updateOne(
      { session_id: sessionID, id: questionID },
      {
        $set: {
          vote: data.vote,
          voters: data.voters
        }
      }
    );
    await broadcastQuestions(sessionID);
  }

  static async list({ sessionID }: IList): Promise<Question[]> {
    const questions = await MongoDBStore.questions()
      .find({ session_id: sessionID })
      .toArray();
    return questions.map((q: any) => Question.fromDatabase(q));
  }

  static async markAs({ questionID, sessionID, status }: IMarkAs): Promise<void>{
    await MongoDBStore.questions().updateOne(
      { session_id: sessionID, id: questionID },
      { $set: { status } }
    );
    await broadcastQuestions(sessionID);
  }
}
export default QuestionAPI;