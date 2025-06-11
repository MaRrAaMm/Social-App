import { Router } from "express";
import * as authService from "./auth.service.js";
import * as authValidation from "./auth.validation.js" 
import { asyncHandler } from "../../utils/error/async-handler.js";
import { isValid } from "../../middlewares/validation.middleware.js";
const router = Router();
//login with google
router.post("/google-login", 
    isValid(authValidation.googleLogin),
    asyncHandler(authService.googleLogin)

)
// send otp
router.post("/send-otp", isValid(authValidation.sendOtp), asyncHandler(authService.sendOtp));

//register
router.post("/register",isValid(authValidation.register), 
        asyncHandler(authService.register)
    );

//login
router.post("/login",isValid(authValidation.login) ,
       authService.login
    );
// activate account
router.get("/activate-account/:token", authService.activateAccount);

router.post("/refresh-token", isValid(authValidation.refreshToken),asyncHandler(authService.refreshToken));
export default router;