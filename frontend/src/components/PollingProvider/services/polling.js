import PollingConfig from "../configs";
import axios from "axios";
import lodash from "lodash";

import PollingItem from "../models/polling-item";
import Polling from "../models/polling";

class PollingService {
  static async create (args) {
    const payload = lodash({
      title: args.title,
      session_id: args.sessionId,
      items: args.items.map(
        (item) => ({
          option: item.option,
          count: item.count,
          order_number: item.orderNumber
        })
      )
    }).omitBy(lodash.isNil).value();

    const url = `${PollingConfig.apiUrl}/pollings`;
    await axios.post(url, payload);
  }

  static async reset ({ sessionId }) {
    const url = `${PollingConfig.apiUrl}/pollings?session_id=${sessionId}`;
    await axios.delete(url);
  }

  static async retrieve ({ sessionId }) {
    const url = `${PollingConfig.apiUrl}/pollings?session_id=${sessionId}`;
    const response = await axios.get(url);
    const data = lodash(response).get("data[0]", {});
    return Polling.fromResponse(data);
  }

  static async start ({ pollingId }) {
    const url = `${PollingConfig.apiUrl}/pollings/${pollingId}?status=started`;
    await axios.put(url);
  }

  static async stop ({ pollingId }) {
    const url = `${PollingConfig.apiUrl}/pollings/${pollingId}?status=pending`;
    await axios.put(url);
  }

  static async poll ({id, itemId, user }) {
    const url = `${PollingConfig.apiUrl}/pollings/${id}/poll`;
    const payload = lodash({
      item_id: itemId,
      user: {
        name: user.name,
        id: user.id
      }
    }).omitBy(lodash.isNil).value();

    await axios.post(url, payload);
  }

  static async retrieveSelected ({ id, user }) {
    const url = `${PollingConfig.apiUrl}/pollings/${id}/poll?user_id=${user.id}`;
    const response = await axios.get(url);
    return PollingItem.fromResponse(response.data);
  }
}

export default PollingService;
