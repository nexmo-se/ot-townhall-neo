import config from "../config/opentok";
import OT from "../utils/opentok";
import Recording from "../entities/recording";
import { Archive } from "opentok";
import { DateTime, Duration } from "luxon";

import OpentokRecordingAPI from "./opentok-recording";
import GhostRiderAPI from "./ghostrider";

interface IList {
  sessionID: string;
}

class RecordingAPI{
  static getEngine(): OpentokRecordingAPI | GhostRiderAPI{
    if(config.recordingMode === "opentok") return new OpentokRecordingAPI();
    else if(config.recordingMode === "ghostrider") return new GhostRiderAPI();
  }
  
  static async create(sessionID: string): Promise<Recording>{
    const engine = RecordingAPI.getEngine();
    const recording = await engine.create(sessionID);
    return recording;
  }
  
  static async destroy(recording: Recording): Promise<void>{
    const engine = RecordingAPI.getEngine();
    await engine.destroy(recording);
  }
  
  static async status(recording: Recording): Promise<string>{
    const foundRecording = await RecordingAPI.retrieve(recording.id);
    return foundRecording.status;
  }

  static async list({ sessionID }: IList): Promise<Recording[]>{
    const engine = RecordingAPI.getEngine();
    const recordings = await engine.list({ sessionID });
    return recordings;
  }
  
  static async retrieveActive(sessionID: string): Promise<Recording[]>{
    const archives = await new Promise((resolve: (value: Archive[]) => void, reject) => {
      OT.getInstance().listArchives({ sessionId: sessionID }, (err: any, archives: Archive[]) => {
        if (err) {
          console.log(err);
          resolve([]);
        } else resolve(archives);
      });
    });
    
    const filteredArchives = archives.filter((archive) => archive.status === "started" || archive.status === "paused");
    const recordings = filteredArchives.map((archive) => new Recording({ 
      id: archive.id, 
      sessionID: archive.sessionId, 
      status: archive.status 
    }));
    return recordings;
  }
  
  static async retrieve(recordingID: string): Promise<Recording>{
    const archive = await new Promise((resolve: (value: Archive) => void, reject) => {
      OT.getInstance().getArchive(recordingID, (err: any, archive: Archive) => {
        if(err) reject(err);
        else resolve(archive);
      });
    });
    const recording = new Recording({
      id: archive.id,
      sessionID: archive.sessionId,
      status: archive.status,
      duration: Duration.fromMillis(parseInt(archive.duration) * 1000),
      createdAt: DateTime.fromMillis(archive.createdAt),
      url: archive.url
    });
    return recording;
  }
  
  static async setLayout(recording:Recording, type:string, streams?:Array<string>): Promise<void>{
    if(type === "presentation" && streams){
      const foundRecording = await RecordingAPI.retrieve(recording.id);
      await new Promise((resolve, reject) => {
        
        // Ignoring below becuase @types/opentok does not specify `setStreamClassLists`
        // @ts-ignore
        OT.getInstance().setStreamClassLists( 
          foundRecording.sessionID, 
          streams.map((streamID) => ({
            id: streamID,
            layoutClassList: [ "focus" ]
          })), 
          (err: any) => {
            if(err) reject(err);
            else resolve();
          }
        );
      });
    }
    
    const normalizedType = (type === "presentation")? "horizontalPresentation": type;
    await new Promise((resolve, reject) => {

      // Ignoring below becuase @types/opentok does not specify `setArchiveLayout`
      // @ts-ignore
      OT.getInstance().setArchiveLayout(
        recording.id, 
        normalizedType, 
        undefined, 
        (err: any) => {
          if(err) reject(err);
          else resolve();
        }
      );
    });
  }
}
export default RecordingAPI;