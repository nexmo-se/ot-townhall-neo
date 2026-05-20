import InMemoryStore from "../api/database";
import { v4 as uuid } from "uuid";

import Poll from "../entities/poll";
import CustomError from "../entities/error";
import PollItem from "../entities/poll-item";
import type { Status } from "../entities/poll";

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
    for (const p of InMemoryStore.pollings.values()) {
      if (p.session_id === poll.sessionID) {
        p.status = "finished";
      }
    }

    InMemoryStore.pollings.set(pollingID, {
      id: pollingID,
      session_id: poll.sessionID,
      title: poll.title,
      status: poll.status,
      created_at: new Date()
    });

    for (const item of poll.items) {
      const itemID = uuid();
      InMemoryStore.pollItems.set(itemID, {
        id: itemID,
        polling_id: pollingID,
        option: item.option,
        count: item.count,
        order_number: item.orderNumber,
        updated_at: new Date(),
        created_at: new Date()
      });
    }
  }

  static async list({ sessionID }: IList): Promise<Poll[]>{
    const matchingPollings: any[] = [];
    for (const p of InMemoryStore.pollings.values()) {
      if (p.session_id === sessionID && p.status !== "finished" && p.status !== "deleted") {
        matchingPollings.push(p);
      }
    }

    if (matchingPollings.length === 0) throw new CustomError("NotFound", "Cannot find pollings");

    const polls = matchingPollings.map((p) => Poll.fromDatabase({
      id: p.id,
      title: p.title,
      session_id: p.session_id,
      status: p.status
    }));

    const finalPolls = polls.map((poll) => {
      const items: PollItem[] = [];
      for (const item of InMemoryStore.pollItems.values()) {
        if (item.polling_id === poll.id) {
          items.push(PollItem.fromDatabase({
            id: item.id,
            option: item.option,
            count: String(item.count),
            order_number: String(item.order_number)
          }));
        }
      }
      return new Poll({ ...poll, items });
    });

    return finalPolls;
  }

  static async poll({ pollID, itemID, userID, name }: IPoll): Promise<void>{
    const id = uuid();
    InMemoryStore.polls.set(id, {
      id,
      polling_id: pollID,
      item_id: itemID,
      user_id: userID,
      name,
      created_at: new Date()
    });

    // Increment count on the poll item
    for (const item of InMemoryStore.pollItems.values()) {
      if (item.polling_id === pollID && item.id === itemID) {
        item.count += 1;
        break;
      }
    }
  }

  static async retrievePoll({ pollingID, userID }: IRetrievePoll): Promise<PollItem>{
    // Find the user's poll vote, sorted by created_at
    const userPolls: any[] = [];
    for (const p of InMemoryStore.polls.values()) {
      if (p.polling_id === pollingID && p.user_id === userID) {
        userPolls.push(p);
      }
    }
    userPolls.sort((a, b) => a.created_at.getTime() - b.created_at.getTime());

    const itemId = userPolls.length > 0 ? userPolls[0].item_id : undefined;
    if (!itemId) return undefined;

    const item = InMemoryStore.pollItems.get(itemId);
    if (!item) return undefined;

    return PollItem.fromDatabase({
      id: item.id,
      option: item.option,
      count: String(item.count),
      order_number: String(item.order_number)
    });
  }

  static async update({ pollingID, status }: IUpdate): Promise<void>{
    const polling = InMemoryStore.pollings.get(pollingID);
    if (polling) {
      polling.status = status;
    }
  }
}
export default PollAPI;