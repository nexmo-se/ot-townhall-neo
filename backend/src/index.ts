import "core-js/stable";
import "regenerator-runtime/runtime";

import express from "express";
import cors from "cors";
import morgan from "morgan";
import * as fsx from "fs-extra"; 

import config from "./config";
import InMemoryStore from "./api/database";
import ErrorHandler from "./middleware/error-handler";

import Firebase from "./utils/firebase";

import QuestionRouter from "./router/question";
import RecordingRouter from "./router/recording";
import RendererRouter from "./router/renderer";
import RoomRouter from "./router/room";
import AMARouter from "./router/ama";
import PollRouter from "./router/poll";
import ConfigurationRouter from "./router/configuration";
import AuthRouter from "./router/auth";
import UploadRouter from "./router/upload";


(async () => {
  Firebase.init();
  InMemoryStore.initialize();

  console.log("Firebase initialised");
  console.log("In-memory store initialised");

  let createDir = __dirname + '/uploads/lobby';
  fsx.ensureDir(createDir);
  
  const app = express();
  
  app.use(express.json());
  app.use(cors());
  app.use(morgan("dev"));
  
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

  app.listen(process.env.PORT, () => {
    console.log(`Express is listening on port: ${config.port || 2000}`);
    console.log("NODE_ENV:", process.env.NODE_ENV);
  });
  
  app.use(ErrorHandler.handle);
})().catch(console.dir);