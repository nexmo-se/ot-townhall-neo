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
        console.log("status", req.body);
        const { sessionId: rendererSession, status, id } = req.body;
        console.log("status", status);
        if (status === "started") {
            await ExperienceRenderer.handleStartedStatus(id, rendererSession); 
        }
        if (status === "stopped") {
          console.log("stopped render");
          await ExperienceRenderer.handleStoppedStatus(id); 
        }
        if (status === "failed") {
            console.log("failed render");
            await ExperienceRenderer.handleFailedStatus(id); 
          }
        res.status(200).send("OK");
      } catch (error) {
        console.log("Renderer Status", error);
        res.status(200).send("OK");
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