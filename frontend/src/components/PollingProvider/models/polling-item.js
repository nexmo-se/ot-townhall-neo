import { v4 as uuid } from "uuid";

class PollingItem {

  constructor (args) {
    this.id = args.id ?? uuid();
    this.option = args.option;
    this.count = args.count ?? 0;
    this.orderNumber = args.orderNumber;
  }

  static fromResponse (response) {
    return new PollingItem({
      id: response.id,
      option: response.option,
      count: response.count,
      orderNumber: response.order_number
    })
  }
}

export default PollingItem;
