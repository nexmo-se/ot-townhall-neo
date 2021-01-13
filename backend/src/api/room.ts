import OT from "../utils/opentok";
import DatabaseAPI from "../api/database";
import opentok from "../config/opentok";
import { QueryResult } from "pg";
import { v4 as uuid } from "uuid";

import Room from "../entities/room";
import CustomError from "../entities/error";

class RoomAPI{
  static parseQueryResponse(queryResponse: QueryResult<any>): Array<Room>{
    return queryResponse.rows.map((response: any) => Room.fromDatabase(response));
  }

  static async createRoom(room: Room): Promise<void>{
    await DatabaseAPI.query(async (client: any) => {
      await client.query(
        "INSERT INTO rooms(id, name, session_id, is_active) VALUES($1, $2, $3, $4)", 
        [ uuid(), room.name, room.sessionID, 1 ]
      );
    });
  }

  static async destroy(room: Room): Promise<void>{
    await DatabaseAPI.query(async (client: any) => {
      await client.query(
        "UPDATE rooms SET is_active = 0 WHERE name = $1",
        [ room.name ]
      );
    });
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
    return await DatabaseAPI.query<Room[]>(async (client) => {
      const queryResponse = await client.query("SELECT * FROM rooms WHERE name = $1 AND is_active = 1", [ room.name ]);
      if(queryResponse.rowCount === 0) throw new CustomError("room/not-found", "Cannot find room");
      else return Promise.resolve(RoomAPI.parseQueryResponse(queryResponse));
    });
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
