import express from "express";
import ash from "express-async-handler";
import validate from "express-validation";

import RendererListener from "../../listeners/renderer";

const router = express.Router();
router.post("/start", ash(RendererListener.start));
router.post("/stop/:id",  ash(RendererListener.stop));
router.post("/status",  ash(RendererListener.status));
router.get("/:roomname",  ash(RendererListener.retrieveArchive));
/* router.get("/",  ash(RendererListener.retrieveArchive)); */

/* router.get("/", ash(RecordingListener.list));
router.get("/active", ash(RecordingListener.retrieveActive));
router.get("/:recording_id", ash(RecordingListener.retrieve));
router.get("/:recording_id/status", ash(RecordingListener.status)); */

/* router.delete("/:recording_id", ash(RecordingListener.destroy)); */

export default router;