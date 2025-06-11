import { Router } from "express";
import { isAuthenticate } from "../../middlewares/auth.middleware.js";
import { isAuthorized } from "../../middlewares/authorization.middleware.js";
import { roles } from "../../db/models/user.model.js";
import { isValid } from "../../middlewares/validation.middleware.js";
import * as commentValidation from "./comment.validation.js";
import * as commentService from "./comment.service.js";
import { asyncHandler } from "../../utils/index.js";
import { cloudUpload, fileValidation } from "../../utils/file uploads/multer cloud.js";

const router = Router({mergeParams:true});


router.post(
  "/:id?",
  isAuthenticate,
  isAuthorized(roles.USER),
  cloudUpload(fileValidation.images).single("attachment"),
  isValid(commentValidation.createComment),
  asyncHandler(commentService.createComment)
);

//get comment
router.get(
  "/:id?",
  isAuthenticate,
  isAuthorized(roles.USER),
  isValid(commentValidation.getComment),
  asyncHandler(commentService.getComment)
);

//delete comment
router.delete(
  "/:id",
  isAuthenticate,
  isAuthorized(roles.USER),
  isValid(commentValidation.deleteComment),
  asyncHandler(commentService.deleteComment)
);
export default router;
