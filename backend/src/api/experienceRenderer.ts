import OT from "../utils/opentok";
import ExperienceRenderer from "../entities/experienceRenderer";

// In-memory stores replacing Firestore collections
const rendererStore: Map<string, any> = new Map(); // rendererId -> renderer data
const rendererRoomStore: Map<string, any> = new Map(); // `${roomName}_${sessionId}` -> renderer data

class ExperienceRendererAPI {
  static async create(roomName: string, sessionId: string): Promise<any> {
    try {
      const result = await OT.createRender(roomName);
      const { sessionId: rendererSession, id: rendererId } = result;
      const experienceRendererEntity = new ExperienceRenderer({
        rendererSession,
        rendererId,
        currentSessionId: sessionId,
        roomName,
        status: "created"
      });
      console.log("experienceRendererEntity", experienceRendererEntity);

      rendererStore.set(rendererId, experienceRendererEntity.saveRendererToDatabase());
      rendererRoomStore.set(`${roomName}_${sessionId}`, experienceRendererEntity.saveRendererRoomNameToDatabase());

      console.log("[experienceRenderer - create] - Result", result);
      return result;
     
    } catch (err) {
      console.log("[experienceRenderer - create] - Err", err);
      return err;
    }
  }

  static async destroy(rendererId: string): Promise<any> {
    try {
      console.log("[experienceRenderer] Destroy rendererId", rendererId);
      const data = rendererStore.get(rendererId);
      if (!data) {
        console.log("destroy - Doc not exists");
        return null;
      }
      const rendererInstance = ExperienceRenderer.fromDatabase(data);
      console.log("[destroy] - rendererInstance", rendererInstance);
      await OT.stopArchive(rendererInstance.archiveId);
      const result = await OT.deleteRender(rendererId);
      return result;
    } catch (err) {
      console.log("[experienceRenderer - destroy] - Err", err);
      return err;
    }
  }

  static async handleStartedStatus(
    rendererId: string,
    rendererSessionId: string
  ): Promise<any> {
    try {
      const data = rendererStore.get(rendererId);
      if (!data) {
        console.log("handleStartedStatus - Doc not exists");
        return {};
      }
      console.log("handleStartedStatus", rendererId);
      data.status = "started";
      rendererStore.set(rendererId, data);

      const rendererInstance = ExperienceRenderer.fromDatabase(data);
      if (
        rendererInstance &&
        rendererSessionId === rendererInstance.rendererSession
      ) {
        const archive = await OT.startArchive(rendererSessionId);
        if (archive) {
          data.archiveId = archive.id;
          rendererStore.set(rendererId, data);

          const roomKey = `${rendererInstance.roomName}_${rendererInstance.currentSessionId}`;
          const roomData = rendererRoomStore.get(roomKey);
          if (roomData) {
            roomData.archiveId = archive.id;
            rendererRoomStore.set(roomKey, roomData);
          }
        }
      }
    } catch (err) {
      console.log("handleStartedStatus", err);
      return err;
    }
  }

  static async handleStoppedStatus(rendererId: string): Promise<any> {
    try {
      const data = rendererStore.get(rendererId);
      if (!data) {
        console.log("handleStoppedStatus - Doc not exists");
        return {};
      }
      const rendererInstance = ExperienceRenderer.fromDatabase(data);
      console.log("rendererInstance", rendererInstance);

      const roomKey = `${rendererInstance.roomName}_${rendererInstance.currentSessionId}`;
      const roomData = rendererRoomStore.get(roomKey);
      if (roomData) {
        roomData.status = "stopped";
        rendererRoomStore.set(roomKey, roomData);
      }

      rendererStore.delete(rendererId);
    } catch (err) {
      console.log("handleStoppedStatus", err);
      return err;
    }
  }

  static async handleFailedStatus(rendererId: string): Promise<any> {
    try {
      const data = rendererStore.get(rendererId);
      if (data) {
        data.status = "failed";
        rendererStore.set(rendererId, data);
      }
    } catch (err) {
      console.log("handleFailedStatus", err);
      return err;
    }
  }

  static async listRenderers(): Promise<any> {
    const result = await OT.listRenderers();
    return result;
  }

  static async retrieveArchive(
    roomName: string,
    sessionId: string
  ): Promise<any> {
    try {
      console.log("[retrieveArchive] - params", roomName, sessionId);
      const roomKey = `${roomName}_${sessionId}`;
      const data = rendererRoomStore.get(roomKey);
      if (!data) {
        console.log("retrieveArchive - Doc not exists");
        return {};
      }
      const rendererInstance = ExperienceRenderer.fromDatabase(data);
      const archives = await OT.getArchive(rendererInstance.rendererSession);
      console.log("[retrieveArchive] - archives", archives);
      return archives;
    } catch (error) {
      console.log("retrieveArchive", error);
      return error;
    }
  }
}
export default ExperienceRendererAPI;
