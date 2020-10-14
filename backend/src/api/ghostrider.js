// @flow
import Recording from "entities/recording";

class GhostRider{
  static create(sessionID:string):Recording{
    return new Recording();
  }
}
export default GhostRider;