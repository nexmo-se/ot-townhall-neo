import Database from "../api/database";

class MongoDBService {
  static async init(): Promise<void> {
    await Database.initialize();
  }

  static async health(): Promise<{ connected: boolean; error?: string }> {
    try {
      const connected = await Database.ping();
      return { connected };
    } catch (err) {
      return {
        connected: false,
        error: err instanceof Error ? err.message : "Unknown database error"
      };
    }
  }

  static async close(): Promise<void> {
    await Database.close();
  }
}

export default MongoDBService;