// @flow
import config from "config";

class QuestionStream {
  static subscribe(sessionID, callback) {
    const url = `${config.apiURL}/questions/stream?session_id=${sessionID}`;
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      try {
        const questions = JSON.parse(event.data);
        callback(questions);
      } catch (e) {
        console.error("Error parsing SSE data", e);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE connection error", err);
    };

    // Return unsubscribe function
    return () => {
      eventSource.close();
    };
  }

  static async fetchQuestions(sessionID) {
    const url = `${config.apiURL}/questions?session_id=${sessionID}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }
}

export default QuestionStream;