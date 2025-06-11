import { Router } from "express"; 
import { isAuthenticate } from "../../middlewares/auth.middleware.js";
import { isAuthorized } from "../../middlewares/authorization.middleware.js"; 
import {roles } from "../../db/models/user.model.js"; 
import { isValid } from "../../middlewares/validation.middleware.js";
import { asyncHandler } from "../../utils/index.js"; 
import * as adminService from "./admin.service.js"; 
import { endPoints } from "./admin.endpoint.js";
import * as adminValidation from "./admin.validation.js";
const router = Router();
router.use(isAuthenticate,isAuthorized(...endPoints.adminDashboard))
 // get all data is 
router.get( 
    "/data",
    isAuthenticate, 
    isAuthorized (roles.ADMIN),
   asyncHandler (adminService.getData ),
);

router.patch(
    "/role",
    isValid(adminValidation.updateRole),
    asyncHandler(adminService.updateRole),
    isAuthenticate,
    isAuthorized(roles.ADMIN),
)

export default router;

