// @flow
import PollingItem from "entities/polling-item";
import { v4 as uuid } from "uuid";

export type Status = "started" | "pending" | "finished";
interface IPolling {
  id?: string;
  title: string;
  items?: PollingItem[];
  status?: Status;
}

class Polling implements IPolling{
  id: string;
  title: string;
  items: PollingItem[];
  status: Status

  constructor(args: IPolling){
    this.id = args.id ?? uuid();
    this.title = args.title;
    this.items = args.items ?? [];
    this.status = args.status ?? "pending";
  }

  static fromResponse(response: any): Polling{
    return new Polling({
      id: response.id,
      title: response.title,
      items: response.items.map((item) => PollingItem.fromResponse(item)),
      status: response.status
    })
  }
}
export default Polling;