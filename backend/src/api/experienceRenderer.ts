import OT from "../utils/opentok";
import admin from "firebase-admin";
import Firestore from "../utils/firestore";
import ExperienceRenderer from "../entities/experienceRenderer";

const collectionName = "renderer_";
const collectionRoomName = "renderer_room_name_";

class ExperienceRendererAPI {
  static async create(roomName: string, sessionId: string): Promise<any>{
      try {
        const result = await OT.createRender(roomName);
        const {sessionId: rendererSession, id: rendererId} = result;
        const experienceRendererEntity = new ExperienceRenderer({
            rendererSession,
            rendererId,
            currentSessionId: sessionId
        });
        console.log("experienceRendererEntity", experienceRendererEntity);
        const db = Firestore.getInstance();
        // todo add EXP REND 
        // TODO add renderer_{id} and renderer_room_name_{roomName}
        await db.collection(`${collectionName}${rendererId}`).doc(rendererId).set(experienceRendererEntity.saveRendererToDatabase());
        await db.collection(`${collectionRoomName}${roomName}`).doc(sessionId).set(experienceRendererEntity.saveRendererRoomNameToDatabase());
        // save instance on Firestore
        return result;
      } catch (err){
          return err;
      }
    
  }

  static async destroy(rendererId: string): Promise<any>{
    const result = await OT.deleteRender(rendererId);
    const db = Firestore.getInstance();
    await db.collection(`${collectionName}${rendererId}`).doc(rendererId).delete();
    // destroy instance? 
    return result;
  }

  static async handleStartedStatus(rendererId: string): Promise<any>{
    const db = Firestore.getInstance();
    try {
        const doc =  await db.collection(`${collectionName}${rendererId}`).doc(rendererId).get();
        if (!doc.exists) {
            console.log("handleStartedStatus - Doc not exists");
            return;
        }
        const rendererInstance = ExperienceRenderer.fromDatabase(doc);
        if (rendererInstance) {
            const archive = await OT.startArchive(rendererInstance.rendererSession);
            if (archive) {
                await db.collection(`${collectionName}${rendererId}`).doc(rendererId).set({archiveId: archive.id});
                // TODO send signal, I need connectionId
                OT.sendRendererStartStatuts(rendererInstance.currentSessionId, rendererInstance.moderatorConnectionId);
            }
     
        }
    } catch (err) {
        console.log("handleStartedStatus", err);
        return err;
    }
    

  }

  static async listRenderers(): Promise<any>{
    const result = await OT.listRenderers();
    return result;
  }

}
export default ExperienceRendererAPI;