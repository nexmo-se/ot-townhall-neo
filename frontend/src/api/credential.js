import Credential from "entities/credential";
import config from "config";

export default class CredentialAPI {
  static async generateCredential ({ role = "publisher", data = {}, tenant }) {
    const response = await fetch(`${config.apiURL}/rooms/${tenant}/info`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, data })
    })
    if(response.ok){
      const jsonResponse = await response.json();
      const credential = new Credential(jsonResponse.apiKey, jsonResponse.sessionId, jsonResponse.token);
      return credential;  
    }else throw new Error(response.statusText);
  }
}