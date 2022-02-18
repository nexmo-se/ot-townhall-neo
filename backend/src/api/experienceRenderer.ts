import OT from "../utils/opentok";
import admin from "firebase-admin";
import Firestore from "../utils/firestore";
import ExperienceRenderer from "../entities/experienceRenderer";

const collectionName = "renderer_";
const collectionRoomName = "renderer_room_name_";

class ExperienceRendererAPI {
  static async create(roomName: string, sessionId: string): Promise<any>{
    const result = await OT.createRender(roomName);
    const { id: rendererId } = result;
    const experienceRendererEntity = new ExperienceRenderer({
        rendererSession: sessionId,
        rendererId,
        currentSessionId: sessionId
    });
    const db = Firestore.getInstance();
    // todo add EXP REND 
    // TODO add renderer_{id} and renderer_room_name_{roomName}
    await db.collection(`${collectionName}${rendererId}`).doc(rendererId).set(experienceRendererEntity.saveRendererToDatabase());
    await db.collection(`${collectionRoomName}${roomName}`).doc(sessionId).set(experienceRendererEntity.saveRendererRoomNameToDatabase());
    // save instance on Firestore
    return result;
  }

  static async destroy(rendererId: string): Promise<any>{
    const result = await OT.deleteRender(rendererId);
    const db = Firestore.getInstance();
    await db.collection(`${collectionName}${rendererId}`).doc(rendererId).delete();
    // destroy instance? 
    return result;
  }

  static async handleStartedStatus(rendererId: string): Promise<any>{
    // here I need to get sessionId from Firestore based on rendererId
    const db = Firestore.getInstance();
    const doc = await db.collection(`${collectionName}${rendererId}`).doc(`${rendererId}`).get();
    // I should get the sessionID fro here and send a signal +  I need to start the actual renderer
    if(!doc.exists) {
        return;
    }
    /* const foundQuestion = Question.fromDatabase(doc);
    const foundVoter = foundQuestion.voters.find((v) => v.id === voter.id);
    const {currentSessionId} = rendererData; */
  }

}
export default ExperienceRendererAPI;