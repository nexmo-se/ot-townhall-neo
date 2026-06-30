import PollAPI from "../api/poll";
import PollItem from "../entities/poll-item";
import Poll from "../entities/poll";
import { Request, Response } from "express";
import type { Status } from "../entities/poll";
import SSEBroadcaster from "../utils/sse";
import { v4 as uuid } from "uuid";

class PollListener{
  static async create(req: Request, res: Response): Promise<void> {
    const { 
      session_id: sessionID, 
      title, 
      items 
    } = req.body;

    const pollItems = items.map((item: any) => PollItem.fromRequest(item));
    const poll = new Poll({ 
      title, 
      sessionID,
      items: pollItems 
    });

    await PollAPI.create(poll);
    return res.json({}).end();
  }

  static async poll(req: Request, res: Response): Promise<void> {
    const { poll_id: pollID } = req.params;
    const { 
      item_id: itemID, 
      user 
    } = req.body;

    await PollAPI.poll({
      pollID,
      itemID,
      userID: user.id,
      name: user.name
    });
    return res.json({}).end();
  }

  static async list(req: Request, res: Response): Promise<void> {
    const { session_id: sessionID } = req.query;
    const polls = await PollAPI.list({ sessionID: `${sessionID}` });
    const payload = polls.map((poll) => poll.toResponse());
    return res.json(payload).end();
  }

  static async retrievePoll(req: Request, res: Response): Promise<void> {
    const { polling_id: pollingID } = req.params;
    const { user_id: userID } = req.query;
    const pollItem = await PollAPI.retrievePoll({ pollingID, userID: `${userID}` });
    if (!pollItem) return res.json(null).end();
    return res.json(pollItem.toResponse()).end();
  }

  static async update(req: Request, res: Response): Promise<void> {
    const { polling_id } = req.params;
    const { status } = req.query;
    
    const acceptedStatus = [ "started", "pending", "finished" ];
    if(acceptedStatus.includes(`${status}`)){
      await PollAPI.update({ 
        pollingID: polling_id, 
        status: status as Status
      });
    }
    return res.json({}).end();
  }

  static async deleteAll(req: Request, res: Response): Promise<void> {
    // get all polling with given session_id

    const { session_id: querySessionID } = req.query;
    const sessionID = `${querySessionID}`;

    let polls: Poll[];
    try {
      polls = await PollAPI.list({ sessionID });
    } catch {
      return res.json({}).end();
    }
    const promises = polls.map((poll) => {
      const acceptedStatus = [ "started", "pending" ];
      if (acceptedStatus.includes(poll.status)) {
        return PollAPI.update({ pollingID: poll.id, status: "deleted" });
      }else return undefined;
    }).filter(Boolean);

    await Promise.all(promises);
    return res.json({}).end();
  }

  static async delete(req: Request, res: Response): Promise<void> {
    throw new Error("Not yet impleted");
  }

  static async stream(req: Request, res: Response): Promise<void> {
    const { session_id: sessionID } = req.query;
    const clientId = uuid();
    SSEBroadcaster.addClient(`poll:${sessionID}`, clientId, res);

    // Push the current poll state immediately on connect
    let polls: Poll[];
    try {
      polls = await PollAPI.list({ sessionID: `${sessionID}` });
    } catch {
      polls = [];
    }
    res.write(`data: ${JSON.stringify(polls.map((p) => p.toResponse()))}\n\n`);
  }
}
export default PollListener;