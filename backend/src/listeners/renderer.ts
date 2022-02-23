import ExperienceRenderer from "../api/experienceRenderer";

import { Request, Response } from "express";

export default class RendererListener {
    
  static async start(req: Request, res: Response): Promise<void> {
    try {
        const { roomName, sessionId } = req.body;
        console.log("start", roomName, sessionId);
        const data = await ExperienceRenderer.create(roomName, sessionId);
        console.log(data);
        /* const { id, sessionId } = data; */
        /* sessions[roomName].renderId = id;
        sessions[roomName].renderedSession = sessionId; */
        res.status(200).send(data);
      } catch (e) {
        res.status(500).send({ message: e });
      }
  }

  static async stop(req: Request, res: Response): Promise<void> {
    try {
        // renderer stop
        const { id } = req.params;
        const data = await ExperienceRenderer.destroy(id);
        console.log(data);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({ message: e });
    }
  }

  static async status(req: Request, res: Response): Promise<void> {
    // webhook status
    try {

        const { sessionId, status, id } = req.body;
        console.log("status", status);
        if (status === "started") {
            const data = await ExperienceRenderer.handleStartedStatus(id); 
          /* for (const [key, value] of Object.entries(sessions)) {
            for (const [key_e, value_e] of Object.entries(value)) {
              if (value_e === id) {
                sessionToSignal = sessions[key].sessionId;
              }
            }
          }
          const response = await opentok.initiateArchiving(sessionId);
          console.log(response);
          const archiveId = response.id;
          const renderedSession = response.sessionId;
          if (response.status === "started") {
            const signalResponse = await opentok.signal(
              sessionToSignal,
              `${archiveId}:${renderedSession}`
            );
          } */
        }
        if (status === "stopped") {
          console.log("stopped render");
        }
        res.status(200).send("OK");
      } catch (error) {
        console.log("Renderer Status", error);
        res.status(500).send({ message: error });
      }
    }

    static async listRenderers(req: Request, res: Response): Promise<void> {
        try {
            const data = await ExperienceRenderer.listRenderers();
            res.status(200).send(data);
        } catch (error) {
            console.log("List Renderer", error);
            res.status(500).send({ message: error });
          } 
    }
}