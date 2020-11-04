import express from "express";
import ash from "express-async-handler";

import RoomListener from "../listeners/room";

const router = express.Router();
router.post("/:room_name/info", ash(RoomListener.info));
router.delete("/:room_name", ash(RoomListener.destroy));
export default router;