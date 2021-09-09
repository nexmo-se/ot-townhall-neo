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

  static async init (): Promise<void>{
    const instance = new MongoClient(database.url, MongoDBService.TlsOptions())
    await instance.connect();
    await instance.db("admin").command({ ping: 1 });

    MongoDBService._instance = instance;
    console.log("Database is connected");
  }

  static async getInstance (): Promise<Db>{
    if (!MongoDBService._instance) await MongoDBService.init()
    return MongoDBService._instance.db(database.name);
  }

  static async close (): Promise<void>{
    if(MongoDBService._instance) await MongoDBService._instance.close();
  }
}
export default MongoDBService;