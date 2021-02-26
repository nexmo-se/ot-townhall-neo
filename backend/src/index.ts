import "core-js/stable";
import "regenerator-runtime/runtime";

import express from "express";
import cors from "cors";
import morgan from "morgan";

import config from "./config";
import DatabaseAPI from "./api/database";
import ErrorHandler from "./middleware/error-handler";

import Firebase from "./utils/firebase";
import MongoDBService from "./utils/mongodb";

import QuestionRouter from "./router/question";
import RecordingRouter from "./router/recording";
import RoomRouter from "./router/room";
import AMARouter from "./router/ama";
import PollRouter from "./router/poll";
import ConfigurationRouter from "./router/configuration";
import AuthRouter from "./router/auth";

(async () => {
  Firebase.init();
  DatabaseAPI.initialize();
  await DatabaseAPI.migrate();

  console.log("Firebase initialised");
  console.log("Database initialised");
  console.log("Database migrated");
  
  const app = express();
  
  app.use(express.json());
  app.use(cors());
  app.use(morgan("dev"));
  
  app.use("/questions", QuestionRouter);
  app.use("/recordings", RecordingRouter);
  app.use("/rooms", RoomRouter);
  app.use("/ama", AMARouter);
  app.use("/pollings", PollRouter);
  app.use("/configurations", ConfigurationRouter);
  app.use("/auth", AuthRouter);
  
  app.listen(process.env.PORT, () => {
    console.log(`Express is listening on port: ${config.port || 2000}`);
  });
  
  app.use(ErrorHandler.handle);
})().catch(console.dir).finally(() => MongoDBService.close());