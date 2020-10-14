// @flow
import config from "config/opentok";
import OT from "utils/opentok";
import Recording from "entities/recording";
import { Stream } from "opentok";

import OpentokRecordingAPI from "api/opentok-recording";
import GhostRiderAPI from "api/ghostrider";

class RecordingAPI{
  static getEngine():any{
    if(config.recordingMode === "opentok") return OpentokRecordingAPI;
    else if(config.recordingMode === "ghostrider") return GhostRiderAPI;
  }
  
  static async create(sessionID:string):Promise<Recording>{
    const engine = RecordingAPI.getEngine();
    const recording = await engine.create(sessionID);
    return recording;
  };
  
  static async destroy(recording:Recording){
    const engine = RecordingAPI.getEngine();
    await engine.destroy(recording);
  }
  
  static async status(recording:Recording){
    const foundRecording = await RecordingAPI.retrieve(recording.id);
    return foundRecording.status;
  }
  
  static async retrieveActive(sessionID:string){
    const archives = await new Promise((resolve, reject) => {
      OT.getInstance().listArchives({ sessionId: sessionID }, (err, archives) => {
        if(err) reject(err);
        else resolve(archives)
      });
    });
    const filteredArchives = archives.filter((archive) => archive.status === "started" || archive.status === "paused");
    const recordings = filteredArchives.map((archive) => new Recording({ id: archive.id, sessionID: archive.sessionId, status: archive.status }));
    return recordings;
  }
  
  static async retrieve(recordingID:string):Promise<Recording>{
    const archive = await new Promise((resolve, reject) => {
      OT.getInstance().getArchive(recordingID, (err, archive) => {
        if(err) reject(err);
        else resolve(archive);
      })
    });
    const recording = new Recording({
      id: archive.id,
      sessionID: archive.sessionId,
      status: archive.status
    })
    return recording;
  }
  
  static async setLayout(recording:Recording, type:string, streams?:Array<string>){
    if(type === "presentation" && streams){
      const foundRecording = await RecordingAPI.retrieve(recording.id);
      await new Promise((resolve, reject) => {
        OT.getInstance().setStreamClassLists(foundRecording.sessionID, streams.map((streamID) => ({
          id: streamID,
          layoutClassList: [ "focus" ]
        })), (err) => {
          if(err) reject(err);
          else resolve();
        })
      });
    }
    
    const normalizedType = (type === "presentation")? "horizontalPresentation": type;
    await new Promise((resolve, reject) => {
      OT.getInstance().setArchiveLayout(recording.id, normalizedType, undefined, (err) => {
        if(err) reject(err);
        else resolve();
      })
    })
  }
}
export default RecordingAPI;