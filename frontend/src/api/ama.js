// @flow
import config from "config";
import Participant from "entities/participant";

class AMAAPI{
  static async create(participant: Participant){
    const response = await fetch(`${config.apiURL}/ama/participants`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(participant.toRequest())
    });
    if(response.ok) return true;
    else throw new Error(response.statusText);
  }
}
export default AMAAPI;