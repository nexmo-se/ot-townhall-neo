declare module "mongodb" {
  export interface Document {
    [key: string]: any;
  }

  export interface MongoClientOptions {
    tls?: boolean;
    tlsCAFile?: string;
    [key: string]: any;
  }

  // Keep the legacy project build stable by using permissive collection/database types.
  export interface Collection<TSchema extends Document = Document> {
    [key: string]: any;
  }

  export interface Db {
    collection<TSchema extends Document = Document>(name: string): Collection<TSchema>;
    command(command: Document): Promise<any>;
  }

  export interface MongoClientInstance {
    db(name?: string): Db;
    close(force?: boolean): Promise<void>;
  }

  export const MongoClient: {
    connect(url: string, options?: MongoClientOptions): Promise<MongoClientInstance>;
  };
}
