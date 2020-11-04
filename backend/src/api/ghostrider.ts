import Recording from "../entities/recording";
import { v4 as uuid } from "uuid";

class GhostRider{
  async create(sessionID: string): Promise<Recording>{
    return new Recording({ id: uuid() });
  }

  async destroy(recording: Recording): Promise<void>{
  }
}
export default GhostRider;