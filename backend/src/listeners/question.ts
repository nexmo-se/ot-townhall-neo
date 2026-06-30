import QuestionAPI from "../api/question";
import Question from "../entities/question";
import User from "../entities/user";
import SSEBroadcaster from "../utils/sse";
import { Request, Response } from "express";
import { v4 as uuid } from "uuid";

class QuestionListener{
  static async create(req: Request, res: Response): Promise<void> {
    console.log("Creating question with body", req.body);
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
    const payload = { id: ref.id };
    return res.json(payload).end();
  }
  
  static async vote(req: Request, res: Response): Promise<void> {
    const { voter, session_id: sessionID } = req.body;
    const { question_id: questionID } = req.params;
    
    const user = new User({ id: voter.id, name: voter.name, role: voter.role });
    await QuestionAPI.vote(sessionID, user, questionID);
    return res.json({}).end();
  }

  static async markAs(req: Request, res: Response): Promise<void> {
    const { question_id: questionID } = req.params;
    const { status, session_id: sessionID } = req.body;
    
    await QuestionAPI.markAs({ questionID, sessionID, status });
    return res.json({}).end();
  }

  static async deleteAll(req: Request, res: Response): Promise<void> {
    const { session_id: sessionID } = req.body;

    const questions = await QuestionAPI.list({ sessionID });
    const promises = questions.map((question) => {
      return QuestionAPI.markAs({
        questionID: question.id,
        status: "deleted",
        sessionID
      })
    });
    await Promise.all(promises);
    return res.json({}).end();
  }

  static async list(req: Request, res: Response): Promise<void> {
    const { session_id: sessionID } = req.query;
    const questions = await QuestionAPI.list({ sessionID: `${sessionID}` });
    const payload = questions.map((q) => q.toResponse());
    return res.json(payload).end();
  }

  static async stream(req: Request, res: Response): Promise<void> {
    try {
      const { session_id: sessionID } = req.query;
      console.log(`[QuestionListener.stream] Starting stream for session: ${sessionID}`);

      const clientId = uuid();
      SSEBroadcaster.addClient(`${sessionID}`, clientId, res);
      console.log(`[QuestionListener.stream] Added client ${clientId} for session ${sessionID}`);

      const questions = await QuestionAPI.list({ sessionID: `${sessionID}` });
      console.log(`[QuestionListener.stream] Found ${questions.length} questions for session ${sessionID}`);
      const payload = questions.map((q) => q.toResponse());
      res.write(`data: ${JSON.stringify(payload)}\n\n`);
      console.log(`[QuestionListener.stream] Sent initial payload: ${JSON.stringify(payload)}`);
    } catch (error) {
      console.error(`[QuestionListener.stream] Error: ${error instanceof Error ? error.message : String(error)}`);
      console.error(error);
      if (!res.writableEnded) {
        res.status(500).json({ error: "Stream initialization failed" });
      }
    }
  }

}

export default QuestionListener;