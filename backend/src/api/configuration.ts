// Ignoring becuase no type definition found
// @ts-ignore
import $ from "mongo-dot-notation";

import MongoDBService from "../utils/mongodb";
import pinConfig from "../config/pin";
import Configuration from "../entities/configuration";

interface IRetrieve{
  tenant?: string;
}

interface ICreateDefault {
  tenant: string;
}

class ConfigurationAPI{
  static async retrieve({ tenant }: IRetrieve): Promise<Configuration | void>{
    const db = await MongoDBService.getInstance();
    const result = await db.collection(Configuration._collectionName).findOne({ tenant });
    if (result) return Configuration.fromDatabase(result);
    else return undefined;
  }

  static async createDefault({ tenant }: ICreateDefault): Promise<Configuration | void>{
    const oldConfiguration = await ConfigurationAPI.retrieve({ tenant });
    if (oldConfiguration) return oldConfiguration;
    else {
      const defaultConfiguration = {
        presenter: {
          login_type: "default",
          pin: pinConfig.presenter
        },
        participant: {
          login_type: "default",
          pin: pinConfig.participant
        },
        moderator : {
          login_type: "default",
          pin: pinConfig.moderator
        },
        tabs: {
          questions: true,
          chat: true,
          participants: true,
          polling: true
        }
      };

      const db = await MongoDBService.getInstance();
      
      await db.collection(Configuration._collectionName).updateOne(
        { tenant },
        {
          $set: {
            tenant,
            configuration: defaultConfiguration
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