import { Collection, Db, Document, MongoClientOptions } from "mongodb";
// Use require for MongoClient to stay compatible with mixed mongodb type sources in dev runtime.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { MongoClient } = require("mongodb");
import mongodbConfig from "../config/mongodb";

export interface RoomRecord extends Document {
  id: string;
  name: string;
  session_id: string;
  is_active: number;
}

export interface ParticipantRecord extends Document {
  id: string;
  tenant: string;
  first_name: string;
  last_name: string;
  email: string;
  company_name: string;
  created_at: Date;
  is_deleted: number;
}

export interface PollingRecord extends Document {
  id: string;
  session_id: string;
  title: string;
  status: string;
  created_at: Date;
}

export interface PollItemRecord extends Document {
  id: string;
  polling_id: string;
  option: string;
  count: number;
  order_number: number;
  updated_at: Date;
  created_at: Date;
}

export interface PollRecord extends Document {
  id: string;
  polling_id: string;
  item_id: string;
  user_id: string;
  name: string;
  created_at: Date;
}

class MongoDBStore {
  private static client: any;
  private static db: Db | undefined;

  static async initialize(): Promise<void> {
    if (MongoDBStore.db) return;

    const options: MongoClientOptions = {};
    if (mongodbConfig.useTls) {
      options.tls = true;
      if (mongodbConfig.tlsCertificate) {
        options.tlsCAFile = mongodbConfig.tlsCertificate;
      }
    }

    MongoDBStore.client = await MongoClient.connect(mongodbConfig.url, options);
    MongoDBStore.db = MongoDBStore.client.db(mongodbConfig.name);
    await MongoDBStore.migrate();
  }

  static async close(): Promise<void> {
    if (MongoDBStore.client) {
      await MongoDBStore.client.close();
      MongoDBStore.client = undefined;
      MongoDBStore.db = undefined;
    }
  }

  static async ping(): Promise<boolean> {
    const result = await MongoDBStore.getDatabase().command({ ping: 1 });
    return result?.ok === 1;
  }

  private static getDatabase(): Db {
    if (!MongoDBStore.db) {
      throw new Error("MongoDB has not been initialized");
    }
    return MongoDBStore.db;
  }

  static rooms(): Collection<RoomRecord> {
    return MongoDBStore.getDatabase().collection<RoomRecord>("rooms");
  }

  static participants(): Collection<ParticipantRecord> {
    return MongoDBStore.getDatabase().collection<ParticipantRecord>("participants");
  }

  static pollings(): Collection<PollingRecord> {
    return MongoDBStore.getDatabase().collection<PollingRecord>("pollings");
  }

  static pollItems(): Collection<PollItemRecord> {
    return MongoDBStore.getDatabase().collection<PollItemRecord>("pollItems");
  }

  static polls(): Collection<PollRecord> {
    return MongoDBStore.getDatabase().collection<PollRecord>("polls");
  }

  static configurations(): Collection<Document> {
    return MongoDBStore.getDatabase().collection<Document>("configurations");
  }

  static questions(): Collection<Document> {
    return MongoDBStore.getDatabase().collection<Document>("questions");
  }

  static renderers(): Collection<Document> {
    return MongoDBStore.getDatabase().collection<Document>("renderers");
  }

  static rendererRooms(): Collection<Document> {
    return MongoDBStore.getDatabase().collection<Document>("rendererRooms");
  }

  static async migrate(): Promise<void> {
    await MongoDBStore.rooms().createIndex({ id: 1 }, { unique: true });
    await MongoDBStore.rooms().createIndex({ name: 1, is_active: 1 });

    await MongoDBStore.participants().createIndex({ id: 1 }, { unique: true });
    await MongoDBStore.participants().createIndex({ tenant: 1, is_deleted: 1 });

    await MongoDBStore.pollings().createIndex({ id: 1 }, { unique: true });
    await MongoDBStore.pollings().createIndex({ session_id: 1, status: 1 });

    await MongoDBStore.pollItems().createIndex({ id: 1 }, { unique: true });
    await MongoDBStore.pollItems().createIndex({ polling_id: 1, order_number: 1 });

    await MongoDBStore.polls().createIndex({ id: 1 }, { unique: true });
    await MongoDBStore.polls().createIndex({ polling_id: 1, user_id: 1, created_at: 1 });

    await MongoDBStore.configurations().createIndex({ tenant: 1 }, { unique: true });
    await MongoDBStore.questions().createIndex({ session_id: 1, id: 1 }, { unique: true });
    await MongoDBStore.renderers().createIndex({ rendererId: 1 }, { unique: true });
    await MongoDBStore.rendererRooms().createIndex(
      { roomName: 1, currentSessionId: 1 },
      { unique: true }
    );
  }
}

export default MongoDBStore;