import OT from "../utils/opentok";
import Recording from "../entities/recording";
import { Archive } from "opentok";

class OpentokRecording{
  async create(sessionID: string): Promise<Recording>{
    const archive = await new Promise((resolve: (value: Archive) => void, reject) => {
      OT.getInstance().startArchive(sessionID, { resolution: "1280x720" }, (err: any, archive: Archive) => {
        if(err) reject(err);
        else resolve(archive);
      });
    });
    const recording = new Recording({ 
      id: archive.id,
      sessionID: archive.sessionId
    });
    return recording;
  }
  
  async destroy(recording: Recording): Promise<void>{
    await new Promise((resolve, reject) => {
      OT.getInstance().stopArchive(recording.id, (err: any) => {
        if(err) reject(err);
        else resolve();
      });
    });
  }
}
export default OpentokRecording;