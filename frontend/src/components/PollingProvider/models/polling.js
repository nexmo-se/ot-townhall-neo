import PollingItem from "./polling-item";
import lodash from "lodash";
import { v4 as uuid } from "uuid";

class Polling {
  constructor (args) {
    this.id = args.id ?? uuid();
    this.title = args.title;
    this.items = args.items ?? [];
    this.status = args.status ?? "pending"
  }

  static fromResponse (response) {
    return new Polling({
      id: response.id,
      title: response.title,
      items: lodash(response.items).map(PollingItem.fromResponse).value(),
      status: response.status
    });
  }
}

export default Polling;
