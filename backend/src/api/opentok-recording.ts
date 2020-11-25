import OT from "../utils/opentok";
import Recording from "../entities/recording";
import { Duration, DateTime } from "luxon";
import { Archive } from "opentok";

interface IList { 
  sessionID: string;
}

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

  async list({ sessionID }: IList): Promise<Recording[]> {
    const rawRecordings = await new Promise<Archive[]>((resolve, reject) => {
      OT.getInstance().listArchives({ sessionId: sessionID }, (err: any, archives: Archive[]) => {
        if (err) {
          console.log(err);
          resolve([]);
        } else resolve(archives)
      })
    });
    
    const recordings = rawRecordings.map((raw) => {
      return new Recording({
        id: raw.id,
        sessionID: raw.sessionId,
        status: raw.status,
        duration: Duration.fromMillis(parseInt(raw.duration) * 1000),
        createdAt: DateTime.fromMillis(raw.createdAt),
        url: raw.url
      })
    })
    return recordings;
  }
}
export default OpentokRecording;