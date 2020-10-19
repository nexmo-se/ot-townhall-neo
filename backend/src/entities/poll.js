// @flow
import PollItem from "entities/poll-item";
import { v4 as uuid } from "uuid";

export type Status = "started" | "pending" | "finished"
interface IPoll{
  id?: string;
  sessionID: string;
  title: string;
  items?: PollItem[];
  status?: Status;
}

class Poll implements IPoll{
  id: string;
  title: string;
  sessionID: string;
  items: PollItem[];
  status: Status

  constructor(args: IPoll){
    this.id = args.id ?? uuid();
    this.title = args.title;
    this.items = args.items ?? [];
    this.sessionID = args.sessionID;
    this.status = args.status ?? "pending"
  }

  toResponse(){
    const jsonData = {
      id: this.id,
      title: this.title,
      items: this.items.map((item) => item.toResponse()),
      session_id: this.sessionID,
      status: this.status
    }
    return JSON.parse(JSON.stringify(jsonData));
  }

  static fromDatabase(row: any): Poll{
    return new Poll({
      id: row.id,
      title: row.title,
      sessionID: row.session_id,
      status: row.status
    })
  }
}
export default Poll;