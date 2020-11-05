import express from "express";
import ash from "express-async-handler";

import ConfigurationListener from "../listeners/configuration";

const router = express.Router();
router.get("/:tenant", ash(ConfigurationListener.retrieveByTenant));
router.put("/:tenant", ash(ConfigurationListener.updateByTenant));

export default router;