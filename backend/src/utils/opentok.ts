// @flow
import OpenTok, { Archive } from "opentok";
import config from "../config/opentok";
import axios from "axios";

import jwt = require("jsonwebtoken");

const rendererStatus = {
    archiveStarted:  "RENDERER_ARCHIVE_STARTED",
    archiveStopped:  "RENDERER_ARCHIVE_STOPPED",
};

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

  static startArchive(sessionId: string): Promise<Archive>{
    return new Promise((resolve, reject) => {
        OT.getInstance().startArchive(
            sessionId,
        {
          resolution: "1280x720",
        },
        function (error, archive) {
          if (error) {
            reject(error);
          } else {
            resolve(archive);
          }
        }
      );
    });
  }
  
  static stopArchive(archiveId: string): Promise<Archive>{
    return new Promise((resolve, reject) => {
        OT.getInstance().getArchive(archiveId, function (err: Error, archive:Archive) {
            if (err) {
              reject(err);
            } else {
                // @ts-ignore
                archive.stop(archiveId, function (error, archiveStopped) {
                    if (error) {
                      reject(error);
                    } else {
                      resolve(archiveStopped);
                    }
                  });
            }
          });
    });
  }

  static createSessionandToken(): Promise<any> {
    return new Promise((resolve, reject) => {
      OT.getInstance().createSession({ mediaMode: "routed" }, function (error, session) {
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
       //  url: `${process.env.RENDERER_URL_PRODUCTION}/${roomName}/ghostrider`,
        url:"https://www.youtube.com/watch?v=h-ce3gPMsGc",
        sessionId: sessionId,
        token: token,
        projectId: apiKey,
        statusCallbackUrl: `${process.env.RENDERER_URL_PRODUCTION}/renderer/status`,
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
      console.log("[OT Utils] - data", response.data);
      return response.data;
    } catch (e) {
      console.log("createRender", e);
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

  static async listRenderers(): Promise<any> {
    try {
        const axiosConfig = {
            method: "get",
            url: `https://api.opentok.com/v2/project/${config.apiKey}/render`,
            headers: {
              "X-OPENTOK-AUTH": await OT.generateRestToken(),
              "Content-Type": "application/json",
            }
          };
          // @ts-ignore: Unreachable code error
          const response = await axios(axiosConfig);
          console.log("[OT Utils] - data", response.data);
          return response.data;
        } catch (e) {
          console.log("createRender", e);
          return e;
        }
  }

  static async sendSignal(type: string, data: any, sessionId: string, connectionId?: string): Promise<any> {
      const toSend = {type,data};
      return new Promise((resolve, reject)=>{
        OT.getInstance().signal(sessionId, connectionId, toSend, (err)=>{
            if (err) {
                reject(err);
            }
            resolve("OK");
        });
      });
    
  }

  static async sendRendererStartStatuts(sessionId: string, connectionId: string): Promise<any> {
    const type = rendererStatus.archiveStarted;
    return OT.sendSignal(type, null, sessionId, connectionId);
  }

}
export default OT;