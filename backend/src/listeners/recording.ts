import RecordingAPI from "../api/recording";
import Recording from "../entities/recording";
import { Request, Response } from "express";

class RecordingListener{
  static async create(req: Request, res: Response): Promise<void>{
    const { session_id: sessionID } = req.body;
    const recording = await RecordingAPI.create(sessionID);
    return res.json(recording.toResponse()).end();
  }
  
  static async setLayout(req: Request, res: Response): Promise<void>{
    const { type, streams } = req.body;
    const { recording_id: recordingID } = req.params;
    
    const recording = new Recording({ id: recordingID});
    await RecordingAPI.setLayout(recording, type, streams);
    return res.status(200).end();
  }
  
  static async destroy(req: Request, res: Response): Promise<void>{
    const { recording_id: recordingID } = req.params;
    const recording = new Recording({ id: recordingID });
    await RecordingAPI.destroy(recording);
    return res.status(200).end();
  }
  
  static async status(req: Request, res: Response): Promise<void>{
    const { recording_id: recordingID } = req.params;
    const recording = new Recording({ id: recordingID });
    const status = await RecordingAPI.status(recording);
    return res.json({ status }).end();
  }
  
  static async retrieveActive(req: Request, res: Response): Promise<void>{
    const { session_id: sessionID } = req.query;
    const recordings = await RecordingAPI.retrieveActive(`${sessionID}`);
    const payload = recordings.map((recording) => recording.toResponse());
    return res.json(payload).end();
  }
}
export default RecordingListener;