import PollingItem from "entities/polling-item";
import { v4 as uuid } from "uuid";

class Polling {

  constructor(args){
    this.id = args.id ?? uuid();
    this.title = args.title;
    this.items = args.items ?? [];
    this.status = args.status ?? "pending";
  }

  static fromResponse(response){
    return new Polling({
      id: response.id,
      title: response.title,
      items: response.items.map((item) => PollingItem.fromResponse(item)),
      status: response.status
    })
  }
}
export default Polling;