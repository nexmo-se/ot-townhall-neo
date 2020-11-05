// @flow
import FetchService from "services/fetch";
import Configuration from "../entities/configuration";
import config from "config";

interface IRetrieve {
  tenant: string;
}

class ConfigurationService{
  static async retrieve({ tenant }: IRetrieve){
    const url = `${config.apiURL}/configurations/${tenant}`
    const response = await FetchService.get(url);
    return Configuration.fromResponse(response);
  }
}
export default ConfigurationService;