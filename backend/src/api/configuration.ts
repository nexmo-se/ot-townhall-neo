import * as configuration from "../data/dummy-tenant-configuration.json";
import Configuration from "../entities/configuration";

interface IRetrieve{
  tenant?: string;
}

class ConfigurationAPI{
  static async retrieve({ tenant }: IRetrieve): Promise<Configuration>{
    if(tenant === "dev") return Configuration.fromDatabase(configuration.dev);
    else throw new Error("Not implemented");
  }
}
export default ConfigurationAPI;