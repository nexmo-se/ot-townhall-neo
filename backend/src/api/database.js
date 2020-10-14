// @flow
import CustomError from "entities/error";
import database from "config/database";
import { Pool } from "pg";

class DatabaseAPI{
  static pool: Pool;

  static async initialize(){
    if(DatabaseAPI.pool) throw new CustomError("database/initialized", "You can only initialized once");
    DatabaseAPI.pool = new Pool({ connectionString: database.url });
  }

  static async migrate(){
    return DatabaseAPI.query(async (client: any) => {
      await client.query(`
        CREATE TABLE IF NOT EXISTS rooms(
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255),
          session_id VARCHAR(255),
          is_active INT2
        )
      `);
      await client.query(`
        CREATE TABLE IF NOT EXISTS participants(
          id VARCHAR(255) PRIMARY KEY,
          first_name VARCHAR(255),
          last_name VARCHAR(255),
          email VARCHAR(255),
          company_name VARCHAR(255),
          created_at TIMESTAMP
        );
      `)
    })
  }

  static async query(func: (client: any) => Promise<any>){
    const client = await DatabaseAPI.client.connect();
    try{
      return await func(client);
    }finally{ client.release() }
  }

  static get client(){
    if(!DatabaseAPI.pool) throw new CustomError("database/not-initialized", "You need to initialize first");
    else return DatabaseAPI.pool;
  }

}
export default DatabaseAPI;