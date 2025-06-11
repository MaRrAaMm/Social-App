import { Router } from "express";
import { isAuthenticate } from "../../middlewares/auth.middleware.js";
import { isAuthorized } from "../../middlewares/authorization.middleware.js";
import { roles } from "../../db/models/user.model.js";
import { cloudUpload } from "../../utils/file uploads/multer cloud.js";
import { fileValidation } from "../../utils/file uploads/multer.js";
import { isValid } from "../../middlewares/validation.middleware.js";
import * as postValidation from "./post.validation.js";
import * as postService from "./post.service.js"
import { asyncHandler } from "../../utils/index.js";
import commentRouter from "../comment/comment.controller.js";
const router = Router();

router.use("/:postId/comment",commentRouter);
// create post
router.post(
    "/", 
    isAuthenticate,
    isAuthorized(roles.USER), 
    cloudUpload(fileValidation.images).array("attachment",5),
    isValid(postValidation.createPost),
    asyncHandler(postService.createPost)
);

// like - unlike
router.patch(
    '/like-unlike/:id',
    isAuthenticate, 
    isAuthorized(roles.USER),
    isValid(postValidation.likeOrUnlike),
    asyncHandler(postService.likeOrUnlike)
);


//get posts
router.get(
  "/",
  isAuthenticate, 
  isAuthorized(roles.USER),
  asyncHandler(postService.getPosts));


router.get(
  "/paginated",
  isAuthenticate, 
  isAuthorized(roles.USER),
  isValid(postValidation.getPostsData),
  asyncHandler(postService.getPostsData));


router.get(
  "/:id",
  isAuthenticate,
  isAuthorized(roles.USER),
  asyncHandler(postService.getSpecificPosts)
);


// delete post
router.delete(
  "/:id",
  isAuthenticate,
  isAuthorized(roles.USER),
  isValid(postValidation.hardDeletePost),
  asyncHandler(postService.hardDeletePost)
);

router.patch(
  "/archive/:id",
  isAuthenticate,
  isAuthorized(roles.USER),
  isValid(postValidation.archivePost),
  asyncHandler(postService.archive)
);

router.patch(
  "/restore/:id",
  isAuthenticate,
  isAuthorized(roles.USER),
  isValid(postValidation.restorePost),
  asyncHandler(postService.restore)
);

export default router;