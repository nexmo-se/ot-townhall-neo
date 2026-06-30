// @flow
import config from "config";
import { io } from "socket.io-client";

class QuestionStream {
  static subscribe(sessionID: string, callback: Function) {
    const socket = io(config.apiURL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    socket.on("connect", () => {
      console.log("[QuestionStream] Connected to WebSocket");
      socket.emit("join:session", sessionID);
    });

    socket.on("questions:update", (questions) => {
      try {
        console.log("[QuestionStream] Received questions update:", questions);
        callback(questions);
      } catch (e) {
        console.error("WebSocket questions parse error", e);
      }
    });

    socket.on("error", (error) => {
      console.error("[QuestionStream] WebSocket error:", error);
    });

    return () => {
      socket.emit("leave:session", sessionID);
      socket.disconnect();
    };
  }

  static async fetchQuestions(sessionID: string) {
    const url = `${config.apiURL}/questions?session_id=${sessionID}`;
    const response = await fetch(url);
    return response.json();
  }
}

export default QuestionStream;
