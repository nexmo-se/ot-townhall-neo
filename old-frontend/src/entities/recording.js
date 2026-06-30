// @flow
import { DateTime, Duration } from "luxon";

interface IRecording {
  id: string;
  sessionID: string | void;
  duration: Duration | void;
  createdAt: DateTime | void;
  url: string | void;
  status: string | void;
}

interface IConstructor { 
  id: string;
  sessionID?: string;
  duration?: Duration;
  createdAt?: DateTime;
  url?: string;
  status?: string;
}

class Recording implements IRecording{
  id: string;
  sessionID: string | void;
  duration: Duration | void;
  createdAt: DateTime | void;
  url: string | void;
  status: string | void;
  
  constructor(args: IConstructor){
    this.id = args.id;
    this.sessionID = args.sessionID;
    this.duration = args.duration;
    this.createdAt = args.createdAt;
    this.url = args.url;
    this.status = args.status;
  }
  
  static fromResponse(data:any):Recording{
    const recording = new Recording({
      id: data.id,
      sessionID: data.session_id,
      duration: data.duration? Duration.fromMillis(data.duration): undefined,
      createdAt: data.created_at? DateTime.fromMillis(data.created_at): undefined,
      url: data.url,
      status: data.status
    })
    return recording;
  }
}
export default Recording;