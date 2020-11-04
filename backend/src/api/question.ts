import admin from "firebase-admin";
import Firestore from "../utils/firestore";

import Question from "../entities/question";
import User from "../entities/user";
import type { TStatus } from "../entities/question";

interface IMarkAs {
  questionID: string;
  sessionID: string;
  status: TStatus;
}

class QuestionAPI{
  static async create(sessionID:string, question:Question):Promise<admin.firestore.DocumentReference>{
    const db = Firestore.getInstance();
    const ref = await db.collection(`questions_${sessionID}`).add(question.toDatabase())
    return ref;
  }
  
  static async vote(sessionID:string, voter:User, questionID: string){
    const db = Firestore.getInstance();
    const doc = await db.collection(`questions_${sessionID}`).doc(questionID).get();
    if(!doc.exists) return;
    const foundQuestion = Question.fromDatabase(doc.data());
    const foundVoter = foundQuestion.voters.find((v) => v.id === voter.id);
    if(foundVoter){
      // Remove the vote
      await db.collection(`questions_${sessionID}`).doc(questionID).update({
        voters: admin.firestore.FieldValue.arrayRemove(voter.toDatabase()),
        vote: admin.firestore.FieldValue.increment(-1)
      })
    }else{
      await db.collection(`questions_${sessionID}`).doc(questionID).update({
        voters: admin.firestore.FieldValue.arrayUnion(voter.toDatabase()),
        vote: admin.firestore.FieldValue.increment(1)
      });
    }
  }

  static async markAs({ questionID, sessionID, status }: IMarkAs){
    const db = Firestore.getInstance();
    const docRef = await db.collection(`questions_${sessionID}`).doc(questionID);
    await docRef.update({ status });
  }
}
export default QuestionAPI;