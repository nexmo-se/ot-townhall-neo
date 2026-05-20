export interface RoomRecord {
  id: string;
  name: string;
  session_id: string;
  is_active: number;
}

export interface ParticipantRecord {
  id: string;
  tenant: string;
  first_name: string;
  last_name: string;
  email: string;
  company_name: string;
  created_at: Date;
  is_deleted: number;
}

export interface PollingRecord {
  id: string;
  session_id: string;
  title: string;
  status: string;
  created_at: Date;
}

export interface PollItemRecord {
  id: string;
  polling_id: string;
  option: string;
  count: number;
  order_number: number;
  updated_at: Date;
  created_at: Date;
}

export interface PollRecord {
  id: string;
  polling_id: string;
  item_id: string;
  user_id: string;
  name: string;
  created_at: Date;
}

class InMemoryStore {
  static rooms: Map<string, RoomRecord> = new Map();
  static participants: Map<string, ParticipantRecord> = new Map();
  static pollings: Map<string, PollingRecord> = new Map();
  static pollItems: Map<string, PollItemRecord> = new Map();
  static polls: Map<string, PollRecord> = new Map();
  static configurations: Map<string, any> = new Map();

  static initialize(): void {
    // No-op for in-memory store
  }

  static async migrate(): Promise<void> {
    // No-op for in-memory store
  }
}

export default InMemoryStore;