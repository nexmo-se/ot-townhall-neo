import express from "express";
import ash from "express-async-handler";

import AMAListener from "../listeners/ama";

const router = express.Router();
router.post("/participants", ash(AMAListener.createParticipant));
export default router;