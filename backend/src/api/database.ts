import CustomError from "../entities/error";
import database from "../config/database";
import { Pool, PoolClient } from "pg";

class DatabaseAPI{
  static pool: Pool;

  static initialize(): void{
    if(DatabaseAPI.pool) throw new CustomError("database/initialized", "You can only initialized once");
    DatabaseAPI.pool = new Pool({ connectionString: database.url });
  }

  static async migrate(): Promise<void>{
    return DatabaseAPI.query(async (client: PoolClient) => {
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
          tenant VARCHAR(255),
          first_name VARCHAR(255),
          last_name VARCHAR(255),
          email VARCHAR(255),
          company_name VARCHAR(255),
          created_at TIMESTAMP
        );
      `);
      await client.query(`
        CREATE TABLE IF NOT EXISTS pollings(
          id VARCHAR(255) PRIMARY KEY,
          session_id VARCHAR(255),
          title VARCHAR(255),
          status VARCHAR(255),
          created_at TIMESTAMP
        )
      `);
      await client.query(`
        CREATE TABLE IF NOT EXISTS poll_items(
          id VARCHAR(255) PRIMARY KEY,
          polling_id VARCHAR(255),
          option VARCHAR(255),
          count INT,
          order_number INT,
          updated_at TIMESTAMP,
          created_at TIMESTAMP
        )
      `);
      await client.query(`
        CREATE TABLE IF NOT EXISTS polls(
          id VARCHAR(255) PRIMARY KEY,
          polling_id VARCHAR(255),
          item_id VARCHAR(255),
          user_id VARCHAR(255),
          name VARCHAR(255),
          created_at TIMESTAMP
        )
      `);
    });
  }

  static async query<T>(func: (client: PoolClient) => Promise<any>): Promise<T>{
    const client = await DatabaseAPI.client.connect();
    try{
      return await func(client);
    }finally{ client.release() }
  }

  static get client(): Pool{
    if(!DatabaseAPI.pool) throw new CustomError("database/not-initialized", "You need to initialize first");
    else return DatabaseAPI.pool;
  }

}
export default DatabaseAPI;