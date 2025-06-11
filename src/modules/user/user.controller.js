import { Router } from "express";
import * as userService from "./user.service.js"
import { isAuthenticate } from "../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../utils/index.js";
import { fileUpload, fileValidation } from "../../utils/file uploads/multer.js";
import { cloudUpload } from "../../utils/file uploads/multer cloud.js";

const router = Router();

// get profile >> /user/profile
router.get(
    "/profile",
    isAuthenticate,
     userService.getProfile);

// freeze account
router.delete("/freeze", isAuthenticate, userService.freezeAccount);

//update
router.put("/update", isAuthenticate,asyncHandler(userService.updateUser));


router.post(
    "/profile-pic",
    isAuthenticate,
    cloudUpload(fileValidation.images,`uploads/users`).single("images"), // busboy
    // validation layer //how to rollback uploading file after fail
    asyncHandler(userService.uploadProfilePicCloud)
);

//upload cover pic
router.post(
    "/cover-pic", 
    isAuthenticate, 
    fileUpload(fileValidation.images).array("images",5), 
    asyncHandler(userService.uploadCoverPic));

//upload cv and license
router.post(
    "/multi-file", 
    isAuthenticate, 
    fileUpload([...fileValidation.images, ...fileValidation.files]).fields([{name: "cv", maxCount:1},{name: "license", maxCount:2}]), 
    asyncHandler(userService.uploadMultiFiles)
);

//delete profile pic
router.delete(
    "/profile-pic", 
    isAuthenticate, 
    asyncHandler(userService.deleteProfilePic)
);
export default router;