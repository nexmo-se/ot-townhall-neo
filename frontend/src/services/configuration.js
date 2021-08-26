import FetchService from "services/fetch";
import Configuration from "entities/configuration";
import config from "config";

class ConfigurationService {
  static async retrieve ({ tenant }) {
    const url = `${config.apiURL}/configurations/${tenant}`
    const response = await FetchService.get(url);
    return Configuration.fromResponse(response);
  }

  static async update ({ tenant, data }) {
    const url = `${config.apiURL}/configurations/${tenant}`;
    await FetchService.put(url, JSON.stringify({ data }));
  }
}
export default ConfigurationService;