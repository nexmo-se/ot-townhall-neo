// @flow
import OT from "utils/opentok";
import Recording from "entities/recording";
import { Stream } from "opentok";

class OpentokRecording{
  static async create(sessionID:string):Promise<Recording>{
    const archive = await new Promise((resolve, reject) => {
      OT.getInstance().startArchive(sessionID, { resolution: "1280x720" }, (err, archive) => {
        if(err) reject(err);
        else resolve(archive);
      })
    })
    const recording = new Recording({ 
      id: archive.id,
      sessionID: archive.sessionId
    });
    return recording;
  };
  
  static async destroy(recording:Recording){
    await new Promise((resolve, reject) => {
      OT.getInstance().stopArchive(recording.id, (err) => {
        if(err) reject(err);
        else resolve();
      })
    })
  }
}
export default OpentokRecording;