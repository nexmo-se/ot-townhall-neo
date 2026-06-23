// @ts-ignore
import $ from "mongo-dot-notation";

import MongoDBStore from "../api/database";
import ConfigurationConfig from "../config/configuration";
import Configuration from "../entities/configuration";

interface DefaultOptions {
  tenant: string;
}

interface RetrieveOptions extends DefaultOptions {};
interface CreateDefaultOptions extends DefaultOptions {};

class ConfigurationAPI{
  static async retrieve({ tenant }: RetrieveOptions): Promise<Configuration | void>{
    const result = await MongoDBStore.configurations().findOne({ tenant });
    if (result) return Configuration.fromDatabase(result);    
    else return undefined;
  }

  /**
   * This will create a configuration if no configuration exists for given tenant name in the parameters.
   * The default configuration is set inside `src/config/configuration.ts` file.
   */
  static async createDefault ({ tenant }: CreateDefaultOptions): Promise<Configuration | void> {
    const oldConfiguration = await ConfigurationAPI.retrieve({ tenant });
    console.log("createDefault - oldConfiguration");
    console.dir(oldConfiguration, { depth: null });
    if (oldConfiguration) {
      return oldConfiguration;
    } else {
      const configData = (tenant.startsWith("vids-")) ? ConfigurationConfig.vidsDefault : ConfigurationConfig.default;
      await MongoDBStore.configurations().insertOne({
        tenant,
        configuration: configData
      });
    }
  }

  static async update(tenant: string, data: any){
    const existing = await MongoDBStore.configurations().findOne({ tenant });
    if (existing) {
      // Deep merge the configuration update
      const flatUpdate = $.flatten({ configuration: data });
      await MongoDBStore.configurations().updateOne(
        { tenant },
        flatUpdate
      );
    }
  }
}
export default ConfigurationAPI;