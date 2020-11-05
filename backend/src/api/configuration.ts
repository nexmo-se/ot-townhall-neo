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
    if (oldConfiguration) return oldConfiguration
    else {
      const defaultConfiguration = {
        presenter: {
          loginType: "default",
          pin: pinConfig.presenter
        },
        participant: {
          loginType: "default",
          pin: pinConfig.participant
        },
        moderator : {
          loginType: "default",
          pin: pinConfig.moderator
        },
        tabs: {
          questions: true,
          chat: true,
          participants: true,
          polling: true
        }
      }

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
}
export default ConfigurationAPI;