import express from "express";
import ash from "express-async-handler";

import ConfigurationListener from "../listeners/configuration";

const router = express.Router();
router.get("/:tenant", ash(ConfigurationListener.retrieveByTenant));

export default router;