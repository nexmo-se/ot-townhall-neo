// @flow
import config from 'config';
import ExperienceRendererEntity from 'entities/experienceComposer';
import { Session } from '@opentok/client';

class ExperienceRendererAPI {
  static async startExperienceRenderer(
    session: Session,
    roomName: string
  ): Promise<ExperienceRendererEntity> {
    let apiURL = config.apiURL;
    if (process.env.NODE_ENV === 'development') {
      apiURL = 'https://c3cc-90-209-142-216.ngrok.io';
    }
    const response = await fetch(`${apiURL}/renderer/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: session.sessionId, roomName })
    });
    if (response.ok) {
      const {
        id: rendererId,
        sessionId,
        createdAt,
        url,
        status
      } = await response.json();
      const recording = new ExperienceRendererEntity({
        id: rendererId,
        sessionID: sessionId,
        createdAt,
        url,
        status
      });
      return recording;
    } else throw new Error(response.statusText);
  }

  static async stopRecording(rendererId: string) {
    let apiURL = config.apiURL;
    if (process.env.NODE_ENV === 'development') {
      apiURL = 'https://c3cc-90-209-142-216.ngrok.io';
    }
    const response = await fetch(`${apiURL}/renderer/stop/${rendererId}`, {
      method: 'POST'
    });
    console.log('stopRecording', response);
    if (response.ok) return;
    else throw new Error(response.statusText);
  }

  static async retrieveActive(roomName: string, sessionID: string) {
    let apiURL = config.apiURL;
    if (process.env.NODE_ENV === 'development') {
      apiURL = 'https://c3cc-90-209-142-216.ngrok.io';
    }
    if (!roomName || !sessionID) {
      throw new Error('[retrieveActive] - Missing params');
    }
    const response = await fetch(
      `${apiURL}/renderer/${roomName}?sessionId=${sessionID}`
    );
    if (response.ok) {
      const jsonResponse = await response.json();
      if (jsonResponse && jsonResponse.count && jsonResponse.items) {
        return jsonResponse.items.map((response) =>
          ExperienceRendererEntity.fromResponse(response)
        );
      }
    } else throw new Error(response.statusText);
  }
}
export default ExperienceRendererAPI;
