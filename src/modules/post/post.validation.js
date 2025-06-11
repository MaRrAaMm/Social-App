import joi from "joi";
import { generalField, isValidId } from "../../middlewares/validation.middleware.js";



//create post
export const createPost = joi
    .object({
    content :joi.string()
   
    ,
    attachment: joi.array().items(generalField.attachment ),
})
 .or("content", "attachment")
.required();

export const likeOrUnlike = joi.object({
    //params
    id:generalField.id,
})
.required();

export const hardDeletePost = joi
  .object({
    id: generalField.id.required()
  })
  .required();


export const getSpecificPost = joi
  .object({
    id: generalField.id.required()
  })
  .required();


export const archivePost = joi
  .object({
    id: generalField.id.required()
  })
  .required();

export const restorePost = joi
  .object({
    id: generalField.id.required()
  })
  .required();

export const getPostsData = joi
  .object({
    page:joi.number().min(1),
    size:joi.number().min(1)
  })
  .required();

