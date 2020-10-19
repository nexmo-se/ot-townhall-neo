// @flow
import { v4 as uuid } from "uuid";

interface IPollingItem{
  id?: string;
  option: string;
  count?: number;
}

class PollingItem implements IPollingItem{
  id: string;
  option: string;
  count: number;

  constructor(args: IPollingItem){
    this.id = args.id ?? uuid();
    this.option = args.option;
    this.count = args.count ?? 0;
  }
}
export default PollingItem;