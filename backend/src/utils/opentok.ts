// @flow
import OpenTok from "opentok";
import config from "../config/opentok";

class OT{
  static instance: OpenTok;
  
  static init(): void{
    OT.instance = new OpenTok(config.apiKey, config.apiSecret);
  }
  
  static getInstance(): OpenTok{
    if(!OT.instance) OT.init();
    return OT.instance;
  }
}
export default OT;