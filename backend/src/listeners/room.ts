import opentok from "../config/opentok";
import { Request, Response } from "express";

import RoomAPI from "../api/room";
import UserAPI from "../api/user";

import User from "../entities/user";
import Room from "../entities/room";


class Roomlistener{
  static async info(req: Request, res: Response): Promise<void>{
    const { room_name: roomName } = req.params;
    const { role } = req.body;
    const data = req.body.data ?? {};

    const user = new User({ role });
    const room = new Room({ name: roomName });
    
    const generatedRoom = await RoomAPI.generateSession(room);
    const generatedUser = UserAPI.generateToken(generatedRoom, user, data);
    const payload = {
      apiKey: opentok.apiKey,
      token: generatedUser.token,
      sessionId: generatedRoom.sessionID
    };
    return res.json(payload).end();
  }

  static async destroy(req: Request, res: Response): Promise<void>{
    const { room_name: roomName } = req.params;
    const room = new Room({ name: roomName });
    await RoomAPI.destroy(room);
    return res.status(200).end();
  }
}
export default Roomlistener;
