import express from "express";
import ash from "express-async-handler";
import PollListener from "../listeners/poll";

const router = express.Router();
router.post("/", ash(PollListener.create));
router.post("/:poll_id/poll", ash(PollListener.poll));

router.get("/", ash(PollListener.list));
router.get("/:polling_id/poll", ash(PollListener.retrievePoll));

router.put("/:polling_id", ash(PollListener.update));

router.delete("/", ash(PollListener.deleteAll));
router.delete("/:poll_id", ash(PollListener.delete));

export default router;
