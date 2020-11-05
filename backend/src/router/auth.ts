import express from "express";
import ash from "express-async-handler";

import AuthListener from "../listeners/auth";

const router = express.Router();
router.post("/", ash(AuthListener.authenticate));

export default router;