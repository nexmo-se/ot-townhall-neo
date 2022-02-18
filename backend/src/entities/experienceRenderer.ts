import admin from "firebase-admin";

interface IExperienceRenderer {
    rendererSession: string;
    rendererId: string;
    currentSessionId: string;
  }


class ExperienceRenderer {
    rendererSession: string;
    rendererId: string;
    currentSessionId: string;
    status: string | null;
  
    constructor(args: IExperienceRenderer){
      this.rendererSession = args.rendererSession;
      this.rendererId = args.rendererId;
      this.currentSessionId = args.currentSessionId;
      this.status = null;
    }

    saveRendererToDatabase(): any {
        return {
            rendererId: this.rendererId,
            status: this.status,
            rendererSession: this.rendererSession,
            currentSessionId: this.currentSessionId
        };
    }

    saveRendererRoomNameToDatabase(): any {
        return {
            /* rendererId: this.rendererId,
            status: this.status, */
            rendererSession: this.rendererSession,
            currentSessionId: this.currentSessionId,
            rendererId: this.rendererId,
        };
    }

    static fromDatabase(data: admin.firestore.DocumentData): ExperienceRenderer{
        const values = data.data();
        console.log("ER - FromDatabase", values);
        const question = new ExperienceRenderer({
            rendererSession: values.rendererSession,
            currentSessionId: values.currentSessionId,
            rendererId: values.rendererId
        });
        return question;
      }
  }

  export default ExperienceRenderer;