// @flow
import QuestionAPI from "api/question";
import Question from "entities/question";
import User from "entities/user";

class QuestionListener{
  static async create(req:any, res:any){
    const { session_id: sessionID, content, owner } = req.body;
    const question = new Question({
      owner: {
        id: owner.id,
        name: owner.name,
        role: owner.role
      },
      content
    });
    const ref = await QuestionAPI.create(sessionID, question);
    const payload = { id: ref.id }
    return res.json(payload).end();
  }
  
  static async vote(req:any, res:any){
    const { voter, session_id: sessionID } = req.body;
    const { question_id: questionID } = req.params;
    
    const question = new Question({ id: questionID });
    const user = new User({ id: voter.id, name: voter.name, role: voter.role });
    await QuestionAPI.vote(sessionID, user, question);
    return res.status(200).end();
  }
}
export default QuestionListener;