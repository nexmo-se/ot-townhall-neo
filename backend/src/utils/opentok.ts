// @flow
import OpenTok from "opentok";
import config from "../config/opentok";
import axios from "axios";

import jwt = require("jsonwebtoken");

class OT{
  static instance: OpenTok;
  
  static init(): void{
    OT.instance = new OpenTok(config.apiKey, config.apiSecret);
  }
  
  static getInstance(): OpenTok{
    if(!OT.instance) OT.init();
    return OT.instance;
  }

  static generateRestToken(): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.sign(
        {
          iss: config.apiKey,
          // iat: Date.now(),
          ist: "project",
          exp: Date.now() + 200,
          jti: Math.random() * 132,
        },
        config.apiSecret,
        { algorithm: "HS256" },
        function (err: any, token: any) {
          if (token) {
            console.log("\n Received token\n", token);
            resolve(token);
          } else {
            console.log("\n Unable to fetch token, error:", err);
            reject(err);
          }
        }
      );
    });
  }

  static createSessionandToken(): Promise<any> {
    return new Promise((resolve, reject) => {
      OT.instance.createSession({ mediaMode: "routed" }, function (error, session) {
        if (error) {
          reject(error);
        } else {
          const sessionId = session.sessionId;
          const token = OT.instance.generateToken(sessionId, {});
          resolve({ sessionId: sessionId, token: token });
        }
      });
    });
  }

  static async getCredentials(): Promise<any> {
    const data = await this.createSessionandToken();
    const sessionId = data.sessionId;
    const token = data.token;
    return { sessionId, token: token, apiKey: config.apiKey };
  }

  static async createRender(roomName: string): Promise<any> {
    try {
      const { sessionId, token, apiKey } = await this.getCredentials();
  
      const data = JSON.stringify({
        url: `${process.env.REACT_APP_API_URL_PRODUCTION}/${roomName}/ghostrider`,
        sessionId: sessionId,
        token: token,
        projectId: apiKey,
        statusCallbackUrl: `${process.env.REACT_APP_API_URL_PRODUCTION}/renderer/status`,
      });
  
      const axiosConfig = {
        method: "post",
        url: `https://api.opentok.com/v2/project/${apiKey}/render`,
        headers: {
          "X-OPENTOK-AUTH": await OT.generateRestToken(),
          "Content-Type": "application/json",
        },
        data: data,
      };
      // @ts-ignore: Unreachable code error
      const response = await axios(axiosConfig);
      return response.data;
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  static async deleteRender(id: string): Promise<any>{
      // deleteRender apiKey
    const axiosConfig = {
      method: "delete",
      url: `https://api.opentok.com/v2/project/${config.apiKey}/render/${id}`,
      headers: {
        "X-OPENTOK-AUTH": await OT.generateRestToken(),
        "Content-Type": "application/json",
      },
    };
  
    try {
        // @ts-ignore: Unreachable code error
      const response = await axios(axiosConfig);
      return response.data;
    } catch (e) {
      console.log(e);
      return e;
    }
  }
}
export default OT;