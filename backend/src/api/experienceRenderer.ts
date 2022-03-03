import OT from "../utils/opentok";
import admin from "firebase-admin";
import Firestore from "../utils/firestore";
import ExperienceRenderer from "../entities/experienceRenderer";

const collectionName = "renderer_";
const collectionRoomName = "renderer_room_name_";

class ExperienceRendererAPI {
  static async create(roomName: string, sessionId: string): Promise<any> {
    try {
      // todo here I should check if a renderer exists
      const db = Firestore.getInstance();
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

      // TODO add moderator connectionId
      await db
        .collection(`${collectionName}${rendererId}`)
        .doc(rendererId)
        .set(experienceRendererEntity.saveRendererToDatabase());
      await db
        .collection(`${collectionRoomName}${roomName}`)
        .doc(sessionId)
        .set(experienceRendererEntity.saveRendererRoomNameToDatabase());
      // save instance on Firestore
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
      const db = Firestore.getInstance();
      const result = await OT.deleteRender(rendererId);
      // todo destroy instance and delete
      /* await db.collection(`${collectionRoomName}${roomName}`).doc(sessionId).delete(); */
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
    const db = Firestore.getInstance();
    try {
      const doc = await db
        .collection(`${collectionName}${rendererId}`)
        .doc(rendererId)
        .get();
      if (!doc.exists) {
        console.log("handleStartedStatus - Doc not exists");
        return {};
      }
      console.log("handleStartedStatus", rendererId);
      await db
        .collection(`${collectionName}${rendererId}`)
        .doc(rendererId)
        .update({ status: "started" });
      const rendererInstance = ExperienceRenderer.fromDatabase(doc);
      if (
        rendererInstance &&
        rendererSessionId === rendererInstance.rendererSession
      ) {
        const archive = await OT.startArchive(rendererSessionId);
        if (archive) {
          await db
            .collection(`${collectionName}${rendererId}`)
            .doc(rendererId)
            .update({ archiveId: archive.id });
          await db
            .collection(`${collectionRoomName}${rendererInstance.roomName}`)
            .doc(rendererInstance.currentSessionId)
            .update({ archiveId: archive.id });
         /*  OT.sendRendererStartStatuts(
            rendererInstance.currentSessionId,
            rendererInstance.moderatorConnectionId
          ); */
        }
      }
    } catch (err) {
      console.log("handleStartedStatus", err);
      return err;
    }
  }

  static async handleStoppedStatus(rendererId: string): Promise<any> {
    const db = Firestore.getInstance();
    try {
      const doc = await db
        .collection(`${collectionName}${rendererId}`)
        .doc(rendererId)
        .get();
      if (!doc.exists) {
        console.log("handleStartedStatus - Doc not exists");
        return {};
      }
      const rendererInstance = ExperienceRenderer.fromDatabase(doc);
      console.log("rendererInstance", rendererInstance);
      // todo this should update the room name collection and delete this
      await db
        .collection(`${collectionRoomName}${rendererInstance.roomName}`)
        .doc(rendererInstance.currentSessionId)
        .update({ status: "stopped" });
      await db
        .collection(`${collectionName}${rendererId}`)
        .doc(rendererId)
        .delete();
    } catch (err) {
      console.log("handleStoppedStatus", err);
      return err;
    }
  }

  static async handleFailedStatus(rendererId: string): Promise<any> {
    const db = Firestore.getInstance();
    try {
      // todo this should update the room name collection and delete this
      await db
        .collection(`${collectionName}${rendererId}`)
        .doc(rendererId)
        .update({ status: "failed" });
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
      const db = Firestore.getInstance();
      console.log("[retrieveArchive] - params", roomName, sessionId);
      const doc = await db
        .collection(`${collectionRoomName}${roomName}`)
        .doc(sessionId)
        .get();
      if (!doc.exists) {
        console.log("retrieveArchive - Doc not exists");
        return {};
      }
      const rendererInstance = ExperienceRenderer.fromDatabase(doc);
      const archives = await OT.getArchive(rendererInstance.rendererSession);
      console.log("[retrieveArchive] - archives", archives);
      return archives;
      /* const filteredArchives = archives.filter((archive) => archive.status === "started" || archive.status === "paused");
        return filteredArchives; */
    } catch (error) {
      console.log("retrieveArchive", error);
      return error;
    }
  }

  // todo difference between retrieveArchive and retrieveActiveArchive
}
export default ExperienceRendererAPI;
