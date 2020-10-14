// @flow
import "core-js/stable";
import "regenerator-runtime/runtime";

import config from "config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import Firebase from "utils/firebase";
import DatabaseAPI from "api/database";
import ErrorHandler from "middleware/error-handler";

import QuestionRouter from "router/question";
import RecordingRouter from "router/recording";
import RoomRouter from "router/room";
import AMARouter from "router/ama";

(async () => {
  await Firebase.init();
  await DatabaseAPI.initialize();
  await DatabaseAPI.migrate();

  console.log("Firebase initialized");
  
  const app = new express();
  
  app.use(express.json());
  app.use(cors());
  app.use(morgan("dev"));
  
  app.use("/questions", QuestionRouter);
  app.use("/recordings", RecordingRouter);
  app.use("/rooms", RoomRouter);
  app.use("/ama", AMARouter);
  
  app.listen(process.env.PORT, () => {
    console.log(`Express is listening on port: ${config.port || 2000}`)
  })
  
  app.use(ErrorHandler.handle);
})()