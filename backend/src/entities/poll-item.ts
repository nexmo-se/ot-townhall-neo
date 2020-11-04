import { v4 as uuid } from "uuid";

interface IPollItem{
  id?: string;
  option: string;
  count?: number;
  orderNumber: number;
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

  toResponse(){
    const jsonData = {
      id: this.id,
      option: this.option,
      count: this.count,
      order_number: this.orderNumber
    }
    return JSON.parse(JSON.stringify(jsonData));
  }

  static fromRequest(request: any){
    return new PollItem({
      id: request.id,
      option: request.option,
      count: parseInt(request.count ?? 0),
      orderNumber: request.order_number
    })
  }

  static fromDatabase(row: any): PollItem{
    return new PollItem({
      id: row.id,
      option: row.option,
      count: parseInt(row.count),
      orderNumber: row.order_number
    });
  }
}
export default PollItem