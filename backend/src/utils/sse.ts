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

    const client: SSEClient = { id: clientId, res };
    const existing = SSEBroadcaster.clients.get(sessionID) || [];
    existing.push(client);
    SSEBroadcaster.clients.set(sessionID, existing);

    console.log(`[SSEBroadcaster.addClient] Registered client ${clientId} for session ${sessionID}. Total clients: ${existing.length + 1}`);

    res.on("close", () => {
      console.log(`[SSEBroadcaster] Client ${clientId} closed connection for session ${sessionID}`);
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
    console.log(`[SSEBroadcaster.broadcast] Broadcasting to ${clients.length} clients for session ${sessionID}`);
    const payload = `data: ${JSON.stringify(data)}\n\n`;
    clients.forEach((client) => {
      try {
        if (!client.res.writable) {
          console.log(`[SSEBroadcaster.broadcast] Client ${client.id} response is not writable, removing`);
          SSEBroadcaster.removeClient(sessionID, client.id);
          return;
        }
        client.res.write(payload);
        console.log(`[SSEBroadcaster.broadcast] Sent data to client ${client.id}`);
      } catch (_error) {
        console.log(`[SSEBroadcaster.broadcast] Error sending to client ${client.id}: ${_error}`);
        SSEBroadcaster.removeClient(sessionID, client.id);
      }
    });
  }
}

export default SSEBroadcaster;