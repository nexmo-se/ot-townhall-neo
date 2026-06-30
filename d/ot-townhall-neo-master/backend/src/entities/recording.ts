import { DateTime, Duration } from "luxon";

interface IRecording {
  id: string;
  sessionID?: string;
  status?: string;
  duration?: Duration;
  createdAt?: DateTime;
  url?: string;
}

class Recording{
  id: string;
  sessionID?: string;
  status?: string;
  duration?: Duration;
  createdAt?: DateTime;
  url?: string;
  
  constructor(args: IRecording){
    this.id = args.id;
    this.sessionID = args.sessionID;
    this.status = args.status;
    this.duration = args.duration;
    this.createdAt = args.createdAt;
    this.url = args.url;
  }
  
  toResponse(): Record<string, string>{
    const jsonData = {
      id: this.id, 
      session_id: this.sessionID,
      status: this.status,
      duration: this.duration?.as("milliseconds"),
      created_at: this.createdAt?.toMillis(),
      url: this.url ?? undefined
    };
    return JSON.parse(JSON.stringify(jsonData));
  }
}
export default Recording;