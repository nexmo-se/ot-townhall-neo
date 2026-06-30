import express from "express";
import ash from "express-async-handler";
import validate from "express-validation";

import QuestionListener from "../../listeners/question";
import Validator from "./validation";

const router = express.Router();
router.post("/", validate(Validator.create), ash(QuestionListener.create));
router.post("/:question_id/vote", validate(Validator.vote), ash(QuestionListener.vote));
router.post("/:question_id/mark_as", ash(QuestionListener.markAs));

router.delete("/", validate(Validator.deleteAll), ash(QuestionListener.deleteAll));
export default router;