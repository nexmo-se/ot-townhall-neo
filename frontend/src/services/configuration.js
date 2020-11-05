// @flow
import FetchService from "services/fetch";
import Configuration from "entities/configuration";
import config from "config";

interface IRetrieve {
  tenant: string;
}

interface IUpdate {
  tenant: string;
  data: any;
}

class ConfigurationService{
  static async retrieve({ tenant }: IRetrieve){
    const url = `${config.apiURL}/configurations/${tenant}`
    const response = await FetchService.get(url);
    return Configuration.fromResponse(response);
  }

  static async update({ tenant, data }: IUpdate){
    const url = `${config.apiURL}/configurations/${tenant}`;
    await FetchService.put(url, JSON.stringify({ data }));
  }
}
export default ConfigurationService;