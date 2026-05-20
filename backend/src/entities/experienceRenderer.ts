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
      this.archiveId = args.archiveId;
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

    static fromDatabase(data: Record<string, any>): ExperienceRenderer{
        console.log("[retrieveArchive] - fromDatabase", data);
        const renderer = new ExperienceRenderer({
            rendererSession: data.rendererSession,
            currentSessionId: data.currentSessionId,
            rendererId: data.rendererId,
            roomName: data.roomName,
            archiveId: data.archiveId,
        });
        return renderer;
      }
  }

  export default ExperienceRenderer;