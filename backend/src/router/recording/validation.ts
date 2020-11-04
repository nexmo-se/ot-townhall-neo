import Joi from "joi";

export default {
  create: {
    body: { session_id: Joi.string().required() }
  },
  setLayout: {
    body: { type: Joi.string().required() }
  }
};