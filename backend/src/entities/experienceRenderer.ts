import admin from "firebase-admin";

interface IExperienceRenderer {
    rendererSession: string;
    rendererId: string;
    currentSessionId: string;
    roomName: string;
    archiveId?: string;
    status?: string;
  }


class ExperienceRenderer {
    rendererSession: string;
    rendererId: string;
    currentSessionId: string;
    roomName: string;
    status: string | null;
    archiveId: string;
  
    constructor(args: IExperienceRenderer){
      this.rendererSession = args.rendererSession;
      this.rendererId = args.rendererId;
      this.currentSessionId = args.currentSessionId;
      this.roomName = args.roomName;
      this.status = args.status;
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
            rendererSession: this.rendererSession,
            currentSessionId: this.currentSessionId,
            rendererId: this.rendererId,
            roomName: this.roomName,
        };
    }

    static fromDatabase(data: admin.firestore.DocumentData): ExperienceRenderer{
        const values = data.data();
        console.log("[retrieveArchive] - fromDatabase", values);
        const renderer = new ExperienceRenderer({
            rendererSession: values.rendererSession,
            currentSessionId: values.currentSessionId,
            rendererId: values.rendererId,
            roomName: values.roomName,
            archiveId: values.archiveId,
        });
        return renderer;
      }
  }

  export default ExperienceRenderer;