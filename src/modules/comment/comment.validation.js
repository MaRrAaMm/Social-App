import joi from "joi";
import { generalField, isValidId } from "../../middlewares/validation.middleware.js";

export const createComment = joi.object({
  id:generalField.id,
  postId: generalField.id.required(),
  text: joi.string(),
  attachment:generalField.attachment,

})
.or("attachment","text")
.required();

export const getComment = joi.object({
  id:generalField.id,
  postId: generalField.id,
})
.required();

export const deleteComment = joi.object({
  id:generalField.id.required(),
  postId: generalField.id.required(),
})
.required();