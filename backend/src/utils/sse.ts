import { Response } from "express";

interface SSEClient {
  id: string;
  res: Response;
}

class SSEBroadcaster {
  private static clients: Map<string, SSEClient[]> = new Map();

  static addClient(sessionID: string, clientId: string, res: Response): void {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });
    res.write("\n");

    const client: SSEClient = { id: clientId, res };
    const existing = SSEBroadcaster.clients.get(sessionID) || [];
    existing.push(client);
    SSEBroadcaster.clients.set(sessionID, existing);

    res.on("close", () => {
      SSEBroadcaster.removeClient(sessionID, clientId);
    });
  }

  static removeClient(sessionID: string, clientId: string): void {
    const existing = SSEBroadcaster.clients.get(sessionID) || [];
    const filtered = existing.filter((c) => c.id !== clientId);
    if (filtered.length === 0) {
      SSEBroadcaster.clients.delete(sessionID);
    } else {
      SSEBroadcaster.clients.set(sessionID, filtered);
    }
  }

  static broadcast(sessionID: string, data: any): void {
    const clients = SSEBroadcaster.clients.get(sessionID) || [];
    const payload = `data: ${JSON.stringify(data)}\n\n`;
    clients.forEach((client) => {
      try {
        if (!client.res.writable) {
          SSEBroadcaster.removeClient(sessionID, client.id);
          return;
        }
        client.res.write(payload);
      } catch (_error) {
        SSEBroadcaster.removeClient(sessionID, client.id);
      }
    });
  }
}

export default SSEBroadcaster;