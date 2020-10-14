// @flow
import RecordingAPI from "api/recording";
import Recording from "entities/recording";

class RecordingListener{
  static async create(req:any, res:any){
    const { session_id: sessionID } = req.body;
    const recording = await RecordingAPI.create(sessionID);
    return res.json(recording.toResponse()).end();
  }
  
  static async setLayout(req:any, res:any){
    const { type, streams } = req.body;
    const { recording_id: recordingID } = req.params;
    
    const recording = new Recording({ id: recordingID});
    await RecordingAPI.setLayout(recording, type, streams);
    return res.status(200).end();
  }
  
  static async destroy(req:any, res:any){
    const { recording_id: recordingID } = req.params;
    const recording = new Recording({ id: recordingID });
    await RecordingAPI.destroy(recording);
    return res.status(200).end();
  }
  
  static async status(req:any, res:any){
    const { recording_id: recordingID } = req.params;
    const recording = new Recording({ id: recordingID });
    const status = await RecordingAPI.status(recording);
    return res.json({ status }).end();
  }
  
  static async retrieveActive(req:any, res:any){
    const { session_id: sessionID } = req.query;
    const recordings = await RecordingAPI.retrieveActive(sessionID);
    const payload = recordings.map((recording) => recording.toResponse());
    return res.json(payload).end();
  }
}
export default RecordingListener;