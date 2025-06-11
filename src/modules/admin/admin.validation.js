import joi from "joi";
import { generalField } from "../../middlewares/validation.middleware.js";
import { roles } from "../../db/models/user.model.js";

export const updateRole = joi.object({
  userId: generalField.id.required(),
  role:joi.string().valid(...Object.values(roles)).required(),
})
.required()