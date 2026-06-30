import { v4 as uuid } from "uuid";

interface IPollItem{
  id?: string;
  option: string;
  count?: number;
  orderNumber: number;
}

interface IRequestData{
  id: string;
  option: string;
  count?: string;
  order_number: string;
}

interface IDatabaseData{
  id: string;
  option: string;
  count: string;
  order_number: string;
}

class PollItem{
  id: string;
  option: string;
  orderNumber: number;
  count: number;

  constructor(args: IPollItem){
    this.id = args.id ?? uuid();
    this.option = args.option;
    this.count = args.count ?? 0;
    this.orderNumber = args.orderNumber;
  }

  toResponse(): Record<string, string>{
    const jsonData = {
      id: this.id,
      option: this.option,
      count: this.count,
      order_number: this.orderNumber
    };
    return JSON.parse(JSON.stringify(jsonData));
  }

  static fromRequest(request: IRequestData): PollItem{
    return new PollItem({
      id: request.id,
      option: request.option,
      count: parseInt(request.count ?? "0"),
      orderNumber: parseInt(request.order_number)
    });
  }

  static fromDatabase(row: IDatabaseData): PollItem{
    return new PollItem({
      id: row.id,
      option: row.option,
      count: parseInt(row.count),
      orderNumber: parseInt(row.order_number)
    });
  }
}
export default PollItem;