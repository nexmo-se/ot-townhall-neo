// @flow
import { v4 as uuid } from "uuid";

interface IPollingItem{
  id?: string;
  option: string;
  count?: number;
  orderNumber: number;
}

class PollingItem implements IPollingItem{
  id: string;
  option: string;
  count: number;
  orderNumber: number;

  constructor(args: IPollingItem){
    this.id = args.id ?? uuid();
    this.option = args.option;
    this.count = args.count ?? 0;
    this.orderNumber = args.orderNumber;
  }

  static fromResponse(response: any): PollingItem{
    return new PollingItem({
      id: response.id,
      option: response.option,
      count: response.count,
      orderNumber: response.order_number
    })
  }
}
export default PollingItem;