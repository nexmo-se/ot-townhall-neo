// @flow
import admin, { DocumentReference } from "firebase-admin";
import Firestore from "utils/firestore";

import Question from "entities/question";
import User from "entities/user";

class QuestionAPI{
  static async create(sessionID:string, question:Question):Promise<DocumentReference>{
    const db = Firestore.getInstance();
    const ref = await db.collection(`questions_${sessionID}`).add(question.toDatabase())
    return ref;
  }
  
  static async vote(sessionID:string, voter:User, question:Question){
    const db = Firestore.getInstance();
    const doc = await db.collection(`questions_${sessionID}`).doc(question.id).get();
    if(!doc.exists) return;
    const foundQuestion = Question.fromDatabase(doc.data());
    const foundVoter = foundQuestion.voters.find((v) => v.id === voter.id);
    if(foundVoter){
      // Remove the vote
      await db.collection(`questions_${sessionID}`).doc(question.id).update({
        voters: admin.firestore.FieldValue.arrayRemove(voter.toDatabase()),
        vote: admin.firestore.FieldValue.increment(-1)
      })
    }else{
      await db.collection(`questions_${sessionID}`).doc(question.id).update({
        voters: admin.firestore.FieldValue.arrayUnion(voter.toDatabase()),
        vote: admin.firestore.FieldValue.increment(1)
      });
    }
  }
}
export default QuestionAPI;