import database from "../config/mongodb";
import { MongoClient, Db } from "mongodb";

class MongoDBService{
  static _instance: MongoClient;

  static TlsOptions (): Record<string, any> {
    if (database.useTls) {
      return {
        tls: true,
        tlsCAFile: `${__dirname}/../certs/${database.tlsCertificate}`
      }
    } else return {}
  }

  static async init(): Promise<void>{
    MongoDBService._instance = new MongoClient(
      database.url,
      {
        useUnifiedTopology: true,
        ...MongoDBService.TlsOptions()
      }
    );

    await MongoDBService._instance.connect();
    await MongoDBService._instance.db("admin").command({ ping: 1 });
    console.log("Database is connected");
  }

  static async getInstance(): Promise<Db>{
    if (!MongoDBService._instance) {
      await MongoDBService.init();
    } else if (MongoDBService._instance && !MongoDBService._instance.isConnected()) {
      await MongoDBService.init();
    }

    return MongoDBService._instance.db(database.name);
  }

  static async close(): Promise<void>{
    if(MongoDBService._instance) await MongoDBService._instance.close();
  }
}
export default MongoDBService;