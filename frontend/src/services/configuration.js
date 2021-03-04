// @flow
import FetchService from "services/fetch";
import Configuration from "entities/configuration";
import config from "config";

interface BaseOptions {
  tenant: string;
}

interface RetrieveOptions extends BaseOptions {};
interface UpdateOptions extends BaseOptions {
  data: any;
}

class ConfigurationService {
  static async retrieve ({ tenant }: RetrieveOptions): Promise<Configuration> {
    const url = `${config.apiURL}/configurations/${tenant}`
    const response = await FetchService.get(url);
    return Configuration.fromResponse(response);
  }

  static async update ({ tenant, data }: UpdateOptions) {
    const url = `${config.apiURL}/configurations/${tenant}`;
    await FetchService.put(url, JSON.stringify({ data }));
  }
}
export default ConfigurationService;