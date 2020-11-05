import database from "../config/mongodb";
import { MongoClient } from "mongodb";

class MongoDBService{
  static _instance: MongoClient;

  static async init(){
    MongoDBService._instance = new MongoClient(database.url, { useUnifiedTopology: true });
    await MongoDBService._instance.connect();
    await MongoDBService._instance.db("admin").command({ ping: 1 });
    console.log("Database is connected");
  }

  static async getInstance(){
    if(!MongoDBService._instance) await MongoDBService.init();
    return MongoDBService._instance.db(database.name);
  }

  static async close(){
    if(MongoDBService._instance) await MongoDBService._instance.close();
  }
}
export default MongoDBService;