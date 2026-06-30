import dotenv from 'dotenv';
dotenv.config();
import "core-js/stable";
import "regenerator-runtime/runtime";

import path from "path";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import * as fsx from "fs-extra";
import http from "http";

import config from "./config";
import ErrorHandler from "./middleware/error-handler";

import MongoDBService from "./utils/mongodb";
import WebSocketBroadcaster from "./utils/websocket-broadcaster";

import QuestionRouter from "./router/question";
import RecordingRouter from "./router/recording";
import RendererRouter from "./router/renderer";
import RoomRouter from "./router/room";
import AMARouter from "./router/ama";
import PollRouter from "./router/poll";
import ConfigurationRouter from "./router/configuration";
import AuthRouter from "./router/auth";
import UploadRouter from "./router/upload";

const serverStartedAt = Date.now();

(async () => {
  await MongoDBService.init();

  console.log("MongoDB initialised");

  let createDir = __dirname + '/uploads/lobby';
  fsx.ensureDir(createDir);
  
  const app = express();
  const server = http.createServer(app);
  
  // Initialize Socket.IO
  const socketIO = require("socket.io");
  const io = new socketIO.Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    },
    transports: ["websocket", "polling"]
  });

  WebSocketBroadcaster.initialize(io);

  // Handle Socket.IO connections
  io.on("connection", (socket: any) => {
    console.log(`[WebSocket] Client connected: ${socket.id}`);

    // Handle joining a session
    socket.on("join:session", (sessionID: string) => {
      console.log(`[WebSocket] Client ${socket.id} joining session: ${sessionID}`);
      WebSocketBroadcaster.joinSession(socket, sessionID);
    });

    // Handle leaving a session
    socket.on("leave:session", (sessionID: string) => {
      console.log(`[WebSocket] Client ${socket.id} leaving session: ${sessionID}`);
      WebSocketBroadcaster.leaveSession(socket, sessionID);
    });

    socket.on("disconnect", () => {
      console.log(`[WebSocket] Client disconnected: ${socket.id}`);
    });
  });
  
  app.use(express.json());
  app.use(cors());
  app.use(morgan("dev"));

  // Health check endpoint with MongoDB connectivity verification
  app.get("/_/health", async (_, res) => {
    const database = await MongoDBService.health();
    const uptimeSeconds = Math.floor((Date.now() - serverStartedAt) / 1000);

    const payload = {
      status: database.connected ? "ok" : "degraded",
      service: "townhall-api",
      uptime_seconds: uptimeSeconds,
      timestamp: new Date().toISOString(),
      database
    };

    const statusCode = database.connected ? 200 : 503;
    return res.status(statusCode).json(payload).end();
  });

  app.use("/questions", QuestionRouter);
  app.use("/recordings", RecordingRouter);
  app.use("/renderer", RendererRouter);
  app.use("/rooms", RoomRouter);
  app.use("/ama", AMARouter);
  app.use("/pollings", PollRouter);
  app.use("/configurations", ConfigurationRouter);
  app.use("/auth", AuthRouter);
  app.use("/upload", UploadRouter);
  
  app.use("/uploaded/lobby", express.static(__dirname + '/uploads/lobby'));

  // Serve built React frontend (prefer build output, fallback to legacy public dir)
  const frontendBuild = fsx.existsSync(path.join(__dirname, "../../frontend/build/index.html"))
    ? path.join(__dirname, "../../frontend/build")
    : path.join(__dirname, "../../frontend/public");
  app.use(express.static(frontendBuild));
  app.get("*", (_, res) => res.sendFile(path.join(frontendBuild, "index.html")));

  server.listen(config.port, () => {
    console.log(`Express + WebSocket server listening on port: ${config.port}`);
    console.log("NODE_ENV:", process.env.NODE_ENV);
  });

  process.on("SIGINT", async () => {
    await MongoDBService.close();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    await MongoDBService.close();
    process.exit(0);
  });
  
  app.use(ErrorHandler.handle);
})().catch(console.dir);