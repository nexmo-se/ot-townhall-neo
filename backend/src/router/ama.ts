import express from "express";
import ash from "express-async-handler";

import AMAListener from "../listeners/ama";

const router = express.Router();
router.post("/participants", ash(AMAListener.createParticipant));
router.get("/", ash(AMAListener.listParticipant));
router.delete("/", ash(AMAListener.resetParticipants));

export default router;