// @ts-ignore
import $ from "mongo-dot-notation";

import InMemoryStore from "../api/database";
import ConfigurationConfig from "../config/configuration";
import Configuration from "../entities/configuration";

interface DefaultOptions {
  tenant: string;
}

interface RetrieveOptions extends DefaultOptions {};
interface CreateDefaultOptions extends DefaultOptions {};

class ConfigurationAPI{
  static async retrieve({ tenant }: RetrieveOptions): Promise<Configuration | void>{
    const result = InMemoryStore.configurations.get(tenant);
    if (result) return Configuration.fromDatabase(result);
    else return undefined;
  }

  /**
   * This will create a configuration if no configuration exists for given tenant name in the parameters.
   * The default configuration is set inside `src/config/configuration.ts` file.
   */
  static async createDefault ({ tenant }: CreateDefaultOptions): Promise<Configuration | void> {
    const oldConfiguration = await ConfigurationAPI.retrieve({ tenant });
    if (oldConfiguration) {
      return oldConfiguration;
    } else {
      const configData = (tenant.startsWith("vids-")) ? ConfigurationConfig.vidsDefault : ConfigurationConfig.default;
      InMemoryStore.configurations.set(tenant, {
        tenant,
        configuration: configData
      });
    }
  }

  static async update(tenant: string, data: any){
    const existing = InMemoryStore.configurations.get(tenant);
    if (existing) {
      // Deep merge the configuration update
      const flatUpdate = $.flatten({ configuration: data });
      for (const [key, value] of Object.entries(flatUpdate.$set || {})) {
        const keys = key.split(".");
        let obj = existing;
        for (let i = 0; i < keys.length - 1; i++) {
          if (obj[keys[i]] === undefined) obj[keys[i]] = {};
          obj = obj[keys[i]];
        }
        obj[keys[keys.length - 1]] = value;
      }
      InMemoryStore.configurations.set(tenant, existing);
    }
  }
}
export default ConfigurationAPI;