// Ignoring becuase no type definition found
// @ts-ignore
import $ from "mongo-dot-notation";

import MongoDBService from "../utils/mongodb";
import ConfigurationConfig from "../config/configuration";
import Configuration from "../entities/configuration";

interface DefaultOptions {
  tenant: string;
}

interface RetrieveOptions extends DefaultOptions {};
interface CreateDefaultOptions extends DefaultOptions {};

class ConfigurationAPI{
  static async retrieve({ tenant }: RetrieveOptions): Promise<Configuration | void>{
    const db = await MongoDBService.getInstance();
    const result = await db.collection(Configuration._collectionName).findOne({ tenant });
    if (result) return Configuration.fromDatabase(result);
    else return undefined;
  }

  /**
   * This will create a configuration if no configuration exists for givent tenant name in the parameters.
   * The default configuration is set inside `src/config/configuration.ts` file.
   * @param 
   */
  static async createDefault ({ tenant }: CreateDefaultOptions): Promise<Configuration | void> {
    const oldConfiguration = await ConfigurationAPI.retrieve({ tenant });
    if (oldConfiguration) {
      return oldConfiguration;
    } else {
      await Configuration.updateOne(
        { tenant },
        {
          $set: {
            tenant,
            configuration: (tenant.startsWith("vids-"))? ConfigurationConfig.vidsDefault: ConfigurationConfig.default
          }
        },
        { upsert: true }
      );
    }
  }

  static async update(tenant: string, data: any){
    const updateData = { configuration: data };
    const db = await MongoDBService.getInstance();
    await db.collection(Configuration._collectionName).updateOne(
      { tenant },
      $.flatten(updateData)
    )
  }
}
export default ConfigurationAPI;