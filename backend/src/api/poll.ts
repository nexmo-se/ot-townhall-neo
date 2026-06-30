import MongoDBStore from "../api/database";
import { v4 as uuid } from "uuid";

import Poll from "../entities/poll";
import CustomError from "../entities/error";
import PollItem from "../entities/poll-item";
import type { Status } from "../entities/poll";
import WebSocketBroadcaster from "../utils/websocket-broadcaster";

async function broadcastPolls(sessionID: string): Promise<void> {
  let polls: Poll[];
  try {
    polls = await PollAPI.list({ sessionID });
  } catch {
    polls = [];
  }
  WebSocketBroadcaster.broadcastPolls(sessionID, polls.map((p) => p.toResponse()));
}

interface IList { sessionID: string; }
interface IRetrievePoll {
  userID: string;
  pollingID: string;
}

interface IPoll {
  pollID: string;
  itemID: string;
  userID: string;
  name: string;
}

interface IUpdate {
  pollingID: string;
  status: Status;
}

class PollAPI{
  static async create(poll: Poll): Promise<void>{
    const pollingID = uuid();

    // Mark existing pollings for this session as finished
    await MongoDBStore.pollings().updateMany(
      { session_id: poll.sessionID },
      { $set: { status: "finished" } }
    );

    await MongoDBStore.pollings().insertOne({
      id: pollingID,
      session_id: poll.sessionID,
      title: poll.title,
      status: poll.status,
      created_at: new Date()
    });

    const now = new Date();
    const items = poll.items.map((item) => {
      const itemID = uuid();
      return {
        id: itemID,
        polling_id: pollingID,
        option: item.option,
        count: item.count,
        order_number: item.orderNumber,
        updated_at: now,
        created_at: now
      };
    });

    if (items.length > 0) {
      await MongoDBStore.pollItems().insertMany(items);
    }
    await broadcastPolls(poll.sessionID);
  }

  static async list({ sessionID }: IList): Promise<Poll[]>{
    const matchingPollings = await MongoDBStore.pollings()
      .find({
        session_id: sessionID,
        status: { $nin: ["finished", "deleted"] }
      })
      .toArray();

    if (matchingPollings.length === 0) throw new CustomError("NotFound", "Cannot find pollings");

    const polls = matchingPollings.map((p: any) => Poll.fromDatabase({
      id: p.id,
      title: p.title,
      session_id: p.session_id,
      status: p.status
    }));

    const pollingIDs = polls.map((poll: Poll) => poll.id);
    const itemRows = await MongoDBStore.pollItems()
      .find({ polling_id: { $in: pollingIDs } })
      .sort({ order_number: 1 })
      .toArray();

    const itemsByPollingID = new Map<string, PollItem[]>();
    for (const row of itemRows) {
      const currentItems = itemsByPollingID.get(row.polling_id) || [];
      currentItems.push(PollItem.fromDatabase({
        id: row.id,
        option: row.option,
        count: String(row.count),
        order_number: String(row.order_number)
      }));
      itemsByPollingID.set(row.polling_id, currentItems);
    }

    return polls.map((poll: Poll) => {
      const items = itemsByPollingID.get(poll.id) || [];
      return new Poll({ ...poll, items });
    });
  }

  static async poll({ pollID, itemID, userID, name }: IPoll): Promise<void>{
    const id = uuid();
    await MongoDBStore.polls().insertOne({
      id,
      polling_id: pollID,
      item_id: itemID,
      user_id: userID,
      name,
      created_at: new Date()
    });

    await MongoDBStore.pollItems().updateOne(
      { polling_id: pollID, id: itemID },
      { $inc: { count: 1 }, $set: { updated_at: new Date() } }
    );

    // Determine sessionID from the polling record to broadcast
    const pollingRow = await MongoDBStore.pollings().findOne({ id: pollID });
    if (pollingRow?.session_id) await broadcastPolls(pollingRow.session_id);
  }

  static async retrievePoll({ pollingID, userID }: IRetrievePoll): Promise<PollItem>{
    const userPoll = await MongoDBStore.polls().findOne(
      { polling_id: pollingID, user_id: userID },
      { sort: { created_at: 1 } }
    );

    const itemId = userPoll?.item_id;
    if (!itemId) return undefined;

    const item = await MongoDBStore.pollItems().findOne({ id: itemId });
    if (!item) return undefined;

    return PollItem.fromDatabase({
      id: item.id,
      option: item.option,
      count: String(item.count),
      order_number: String(item.order_number)
    });
  }

  static async update({ pollingID, status }: IUpdate): Promise<void>{
    await MongoDBStore.pollings().updateOne(
      { id: pollingID },
      { $set: { status } }
    );
    const pollingRow = await MongoDBStore.pollings().findOne({ id: pollingID });
    if (pollingRow?.session_id) await broadcastPolls(pollingRow.session_id);
  }
}
export default PollAPI;