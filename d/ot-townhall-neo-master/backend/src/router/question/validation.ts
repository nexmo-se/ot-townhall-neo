import Joi from "joi";

export default {
  create: {
    body: {
      content: Joi.string().required(),
      owner: Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
        role: Joi.string().required()
      }).required(),
      session_id: Joi.string().required()
    }
  },
  deleteAll : {
    body: {
      session_id: Joi.string().required()
    }
  },
  vote: {
    body: {
      session_id: Joi.string().required(),
      voter: Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
        role: Joi.string().required()
      }).required()
    }
  }
};