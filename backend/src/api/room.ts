import OT from "../utils/opentok";
import InMemoryStore from "../api/database";
import opentok from "../config/opentok";
import { v4 as uuid } from "uuid";

import Room from "../entities/room";
import CustomError from "../entities/error";

class RoomAPI{
  static async createRoom(room: Room): Promise<void>{
    const id = uuid();
    InMemoryStore.rooms.set(id, {
      id,
      name: room.name,
      session_id: room.sessionID,
      is_active: 1
    });
  }

  static async destroy(room: Room): Promise<void>{
    for (const [id, r] of InMemoryStore.rooms) {
      if (r.name === room.name) {
        r.is_active = 0;
        InMemoryStore.rooms.set(id, r);
      }
    }
  }

  static async generateSession(room: Room): Promise<Room>{
    const isExists = await RoomAPI.isExistsById(room);
    if(!isExists){
      return new Promise((resolve, reject) => {
        OT.getInstance().createSession({ mediaMode: opentok.mediaMode }, async (err, session) => {
          if(err) reject(new CustomError("room/err", err.message));
          else {
            const newRoom = new Room({ name: room.name, sessionID: session.sessionId });
            await RoomAPI.createRoom(newRoom);
            resolve(newRoom);
          }
        });
      });
    }else{
      const [selectedRoom] = await RoomAPI.getDetailById(room);
      return Promise.resolve(selectedRoom);
    }
  }

  static async getDetailById(room: Room): Promise<Room[]>{
    const results: Room[] = [];
    for (const r of InMemoryStore.rooms.values()) {
      if (r.name === room.name && r.is_active === 1) {
        results.push(Room.fromDatabase({
          id: r.id,
          name: r.name,
          session_id: r.session_id
        }));
      }
    }
    if (results.length === 0) throw new CustomError("room/not-found", "Cannot find room");
    return results;
  }

  static async isExistsById(room: Room): Promise<boolean>{
    try{
      await RoomAPI.getDetailById(room);
      return Promise.resolve(true);
    }catch(err){
      if(err.code === "room/not-found") return Promise.resolve(false);
      else throw err;
    }
  }
}
export default RoomAPI;
