import admin from "firebase-admin";

interface IExperienceRenderer {
    rendererSession: string;
    rendererId: string;
    currentSessionId: string;
    roomName: string;
    moderatorConnectionId?: string;
    
  }


class ExperienceRenderer {
    rendererSession: string;
    rendererId: string;
    currentSessionId: string;
    moderatorConnectionId: string;
    roomName: string;
    status: string | null;
  
    constructor(args: IExperienceRenderer){
      this.rendererSession = args.rendererSession;
      this.rendererId = args.rendererId;
      this.currentSessionId = args.currentSessionId;
      this.moderatorConnectionId = args.moderatorConnectionId;
      this.roomName = args.roomName;
      this.status = null;
    }

    saveRendererToDatabase(): any {
        return {
            rendererId: this.rendererId,
            status: this.status,
            rendererSession: this.rendererSession,
            currentSessionId: this.currentSessionId,
            roomName: this.roomName
        };
    }

    saveRendererRoomNameToDatabase(): any {
        return {
            /* rendererId: this.rendererId,
            status: this.status, */
            rendererSession: this.rendererSession,
            currentSessionId: this.currentSessionId,
            rendererId: this.rendererId,
            roomName: this.roomName
        };
    }

    static fromDatabase(data: admin.firestore.DocumentData): ExperienceRenderer{
        const values = data.data();
        const question = new ExperienceRenderer({
            rendererSession: values.rendererSession,
            currentSessionId: values.currentSessionId,
            rendererId: values.rendererId,
            moderatorConnectionId: values.moderatorConnectionId,
            roomName: values.roomName
        });
        return question;
      }
  }

  export default ExperienceRenderer;