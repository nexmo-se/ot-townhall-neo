// @flow
import { DateTime } from 'luxon';

interface IExperienceRenderer {
  id: string;
  sessionID: string | void;
  createdAt: DateTime | void;
  url: string | void;
  status: string | void;
}

interface IConstructor {
  id: string;
  sessionID?: string;
  createdAt?: DateTime;
  url?: string;
  status?: string;
}

class ExperienceRenderer implements IExperienceRenderer {
  id: string;
  sessionID: string | void;
  createdAt: DateTime | void;
  url: string | void;
  status: string | void;

  constructor(args: IConstructor) {
    this.id = args.id;
    this.sessionID = args.sessionID;
    this.createdAt = args.createdAt;
    this.url = args.url;
    this.status = args.status;
  }

  static fromResponse(data: any): ExperienceRenderer {
    const renderer = new ExperienceRenderer({
      id: data.id,
      sessionID: data.sessionId,
      createdAt: data.createdAt
        ? DateTime.fromMillis(data.createdAt)
        : undefined,
      url: data.url,
      status: data.status
    });
    return renderer;
  }
}
export default ExperienceRenderer;
