import FetchService from "services/fetch";
import config from "config";

import PollingItem from "entities/polling-item";
import Polling from "entities/polling";

class PollingAPI{
  static async create(args){
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

  static async retrieve({ sessionID }){
    const url = `${config.apiURL}/pollings?session_id=${sessionID}`;
    const [ response ] = await FetchService.get(url);
    return Polling.fromResponse(response);
  }

  static async start({ pollingID }){
    const url = `${config.apiURL}/pollings/${pollingID}?status=started`;
    await FetchService.put(url);
  }

  static async stop({ pollingID }){
    const url = `${config.apiURL}/pollings/${pollingID}?status=pending`;
    await FetchService.put(url);
  }
  
  static async poll({ id, itemID, user }){
    const url = `${config.apiURL}/pollings/${id}/poll`
    const payload = {
      item_id: itemID,
      user: { name: user.name, id: user.id }
    }
    await FetchService.post(url, JSON.stringify(payload));
  }

  static async retireveSelected({ id, user }){
    const url = `${config.apiURL}/pollings/${id}/poll?user_id=${user.id}`;
    const response = await FetchService.get(url);
    return PollingItem.fromResponse(response);
  }
}
export default PollingAPI;