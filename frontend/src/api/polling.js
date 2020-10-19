import FetchService from "services/fetch";
import config from "config";

import PollingItem from "entities/polling-item";
import Polling from "entities/polling";
import User from "entities/user";

export interface ICreate {
  title: string;
  sessionID: string;
  items: PollingItem[];
}

export interface IRetrieveSelected {
  id: string;
  user: User;
}

export interface IPoll {
  id: string;
  itemID: string;
  user: User;
}

class PollingAPI{
  static async create(args: ICreate){
    const payload = {
      title: args.title,
      session_id: args.sessionID,
      items: args.items.map((item) => ({
        option: item.option,
        count: item.count,
        order_number: item.orderNumber
      }))
    }
    const url = `${config.apiURL}/pollings`;
    await FetchService.post(url, JSON.stringify(payload));
  }

  static async retrieve({ sessionID }: { sessionID: string }){
    const url = `${config.apiURL}/pollings?session_id=${sessionID}`;
    const [ response ] = await FetchService.get(url);
    return Polling.fromResponse(response);
  }

  static async start({ pollingID }: { pollingIDs: string }){
    const url = `${config.apiURL}/pollings/${pollingID}?status=started`;
    await FetchService.put(url);
  }

  static async stop({ pollingID }: { pollingID: string }){
    const url = `${config.apiURL}/pollings/${pollingID}?status=pending`;
    await FetchService.put(url);
  }
  
  static async poll({ id, itemID, user }: IPoll){
    const url = `${config.apiURL}/pollings/${id}/poll`
    const payload = {
      item_id: itemID,
      user: { name: user.name, id: user.id }
    }
    await FetchService.post(url, JSON.stringify(payload));
  }

  static async retireveSelected({ id, user }: IRetrieveSelected): Promise<PollingItem>{
    const url = `${config.apiURL}/pollings/${id}/poll?user_id=${user.id}`;
    const response = await FetchService.get(url);
    return PollingItem.fromResponse(response);
  }
}
export default PollingAPI;