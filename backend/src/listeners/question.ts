import QuestionAPI from "../api/question";
import Question from "../entities/question";
import User from "../entities/user";

class QuestionListener{
  static async create(req: any, res: any){
    const { session_id: sessionID, content, owner, status } = req.body;
    const question = new Question({
      owner: new User({
        id: owner.id,
        name: owner.name,
        role: owner.role
      }),
      content,
      status
    });
    const ref = await QuestionAPI.create(sessionID, question);
    const payload = { id: ref.id }
    return res.json(payload).end();
  }
  
  static async vote(req: any, res: any){
    const { voter, session_id: sessionID } = req.body;
    const { question_id: questionID } = req.params;
    
    const user = new User({ id: voter.id, name: voter.name, role: voter.role });
    await QuestionAPI.vote(sessionID, user, questionID);
    return res.json({}).end();
  }

  static async markAs(req: any, res: any){
    const { question_id: questionID } = req.params;
    const { status, session_id: sessionID } = req.body;
    
    await QuestionAPI.markAs({ questionID, sessionID, status });
    return res.json({}).end();
  }
}
export default QuestionListener;