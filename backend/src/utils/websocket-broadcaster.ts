// Using any types here to avoid socket.io type issues with older TS versions
const socketIO: any = require("socket.io");

class WebSocketBroadcaster {
  private static io: any = null;

  static initialize(io: any): void {
    WebSocketBroadcaster.io = io;
    console.log("[WebSocketBroadcaster] Initialized");
  }

  /**
   * Join a session room for a socket
   */
  static joinSession(socket: any, sessionID: string, clientType: string = "default"): void {
    const room = `session:${sessionID}`;
    socket.join(room);
    console.log(`[WebSocketBroadcaster.joinSession] Client ${socket.id} joined room: ${room} (type: ${clientType})`);
  }

  /**
   * Leave a session room
   */
  static leaveSession(socket: any, sessionID: string): void {
    const room = `session:${sessionID}`;
    socket.leave(room);
    console.log(`[WebSocketBroadcaster.leaveSession] Client ${socket.id} left room: ${room}`);
  }

  /**
   * Broadcast questions update to all clients in a session
   */
  static broadcastQuestions(sessionID: string, questions: any[]): void {
    if (!WebSocketBroadcaster.io) {
      console.error("[WebSocketBroadcaster.broadcastQuestions] IO not initialized");
      return;
    }
    const room = `session:${sessionID}`;
    console.log(`[WebSocketBroadcaster.broadcastQuestions] Broadcasting ${questions.length} questions to room: ${room}`);
    WebSocketBroadcaster.io.to(room).emit("questions:update", questions);
  }

  /**
   * Broadcast polls update to all clients in a session
   */
  static broadcastPolls(sessionID: string, polls: any[]): void {
    if (!WebSocketBroadcaster.io) {
      console.error("[WebSocketBroadcaster.broadcastPolls] IO not initialized");
      return;
    }
    const room = `session:${sessionID}`;
    console.log(`[WebSocketBroadcaster.broadcastPolls] Broadcasting ${polls.length} polls to room: ${room}`);
    WebSocketBroadcaster.io.to(room).emit("polls:update", polls);
  }

  /**
   * Get the Socket.IO instance
   */
  static getIO(): any {
    return WebSocketBroadcaster.io;
  }
}

export default WebSocketBroadcaster;
