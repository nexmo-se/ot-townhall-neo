import OT from "../utils/opentok";
import User from "../entities/user";
import Room from "../entities/room";

class UserAPI{
  static generateToken(room: Room, user: User, data: Record<string, string>): User{
    const token = OT.getInstance().generateToken(room.sessionID, { role: user.role, data: JSON.stringify(data) });
    const newUser = new User({ 
      id: user.id, 
      role: user.role,
      token 
    });
    return newUser;
  }
}
export default UserAPI;
