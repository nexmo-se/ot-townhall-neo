import Recording from "../entities/recording";

class GhostRider{
  async create(): Promise<Recording>{
    throw new Error("Not yet implemented");
  }

  async destroy(): Promise<void>{
    throw new Error("Not yet implemented");
  }

  async list(): Promise<Recording[]> {
    throw new Error("Not yet implemented");
  }
}
export default GhostRider;