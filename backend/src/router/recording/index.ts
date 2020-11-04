import express from "express";
import ash from "express-async-handler";
import validate from "express-validation";

import RecordingListener from "../../listeners/recording";
import Validator from "./validation";

const router = express.Router();
router.post("/", validate(Validator.create), ash(RecordingListener.create));
router.post("/:recording_id/layout", validate(Validator.setLayout), ash(RecordingListener.setLayout));
router.delete("/:recording_id", ash(RecordingListener.destroy));
router.get("/:recording_id/status", ash(RecordingListener.status));
router.get("/active", ash(RecordingListener.retrieveActive));

export default router;