import OT from "../utils/opentok";
import ExperienceRenderer from "../entities/experienceRenderer";
import MongoDBStore from "../api/database";

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

      await MongoDBStore.renderers().updateOne(
        { rendererId },
        { $set: experienceRendererEntity.saveRendererToDatabase() },
        { upsert: true }
      );
      await MongoDBStore.rendererRooms().updateOne(
        { roomName, currentSessionId: sessionId },
        { $set: experienceRendererEntity.saveRendererRoomNameToDatabase() },
        { upsert: true }
      );

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
      const data = await MongoDBStore.renderers().findOne({ rendererId });
      if (!data) {
        console.log("destroy - Doc not exists");
        return null;
      }
      const rendererInstance = ExperienceRenderer.fromDatabase(data);
      console.log("[destroy] - rendererInstance", rendererInstance);
      if (rendererInstance.archiveId) {
        await OT.stopArchive(rendererInstance.archiveId);
      }
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
      const data = await MongoDBStore.renderers().findOne({ rendererId });
      if (!data) {
        console.log("handleStartedStatus - Doc not exists");
        return {};
      }
      console.log("handleStartedStatus", rendererId);
      await MongoDBStore.renderers().updateOne(
        { rendererId },
        { $set: { status: "started" } }
      );

      const rendererInstance = ExperienceRenderer.fromDatabase(data);
      if (
        rendererInstance &&
        rendererSessionId === rendererInstance.rendererSession
      ) {
        const archive = await OT.startArchive(rendererSessionId);
        if (archive) {
          await MongoDBStore.renderers().updateOne(
            { rendererId },
            { $set: { archiveId: archive.id } }
          );
          await MongoDBStore.rendererRooms().updateOne(
            {
              roomName: rendererInstance.roomName,
              currentSessionId: rendererInstance.currentSessionId
            },
            { $set: { archiveId: archive.id } }
          );
        }
      }
    } catch (err) {
      console.log("handleStartedStatus", err);
      return err;
    }
  }

  static async handleStoppedStatus(rendererId: string): Promise<any> {
    try {
      const data = await MongoDBStore.renderers().findOne({ rendererId });
      if (!data) {
        console.log("handleStoppedStatus - Doc not exists");
        return {};
      }
      const rendererInstance = ExperienceRenderer.fromDatabase(data);
      console.log("rendererInstance", rendererInstance);

      await MongoDBStore.rendererRooms().updateOne(
        {
          roomName: rendererInstance.roomName,
          currentSessionId: rendererInstance.currentSessionId
        },
        { $set: { status: "stopped" } }
      );

      await MongoDBStore.renderers().deleteOne({ rendererId });
    } catch (err) {
      console.log("handleStoppedStatus", err);
      return err;
    }
  }

  static async handleFailedStatus(rendererId: string): Promise<any> {
    try {
      await MongoDBStore.renderers().updateOne(
        { rendererId },
        { $set: { status: "failed" } }
      );
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
      const data = await MongoDBStore.rendererRooms().findOne({
        roomName,
        currentSessionId: sessionId
      });
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
