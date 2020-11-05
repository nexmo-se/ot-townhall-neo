// import * as configuration from "../data/dummy-tenant-configuration.json";
import Configuration from "../entities/configuration";
import MongoDBService from "../utils/mongodb";

interface IRetrieve{
  tenant?: string;
}

class ConfigurationAPI{
  static async retrieve({ tenant }: IRetrieve): Promise<Configuration>{
    const db = await MongoDBService.getInstance();
    const result = await db.collection(Configuration._collectionName).findOne({ tenant });
    return Configuration.fromDatabase(result);
  }
}
export default ConfigurationAPI;