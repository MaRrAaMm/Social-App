import { User } from "../../db/models/user.model.js";
import { OTP } from "../../db/models/otp.model.js";
import Randomstring from "randomstring";
import { 
    asyncHandler,
    compare,
    encrypt,
    generaToken,
    hash,
    sendEmail,
    sendEmailEvent,
    verifyToken
 } 
from "../../utils/index.js";
import { message } from "../../utils/messages/index.js";
import { OAuth2Client } from "google-auth-library";

export const sendOtp = async(req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({email});
    if(user) return next(new Error(message.USER.alreadyExist, {cause:404}));
    const otp = Randomstring.generate({length:5, charset:"numeric"});
    // const otp = Math.floor(1000000+Math.random()*900000);
    sendEmailEvent.emit("sendEmail", email ,otp);
    //save into db
   await OTP.create({email,otp});
    return res.status(201).json({
        success: true,
        message:message.otp.createdSuccessfully
    });
};
export const register = async (req, res, next) => {
    // get data from req?
    const { userName, email, password, phone, otp } = req.body;
   
    //check otp
    const otpExist = await OTP.findOne({email}).sort({ _id: -1 });
    if(!otpExist) return next(new Error(message.otp.notFound, {cause: 404}));
    console.log("Stored OTP:", otpExist.otp);
    if(otpExist.otp != otp)
        return next(new Error("invalid otp",{cause:404}));
    await OTP.deleteOne({ _id: otpExist._id });
    // create user
    const createdUser = await User.create({
        userName,
        email,
        password,
        phone: encrypt({plaintext: phone}),
        
    });
    
    // send response
    return res.status(201).json({
        success: true,
        message: "user created successfully",
        data: createdUser,
    });
};

export const login = asyncHandler(async (req, res, next) => {
    //get data from req
    const { email, password } = req.body;
    const userExist = await User.findOne({ email });
    if (!userExist) {
        return next(new Error("email not found", { cause: 401 }));
        
    }
    
    if(userExist.isDeleted == true){
        await User.updateOne({_id: userExist._id},{isDeleted: false});
    }
    const match = compare({password, hashedPassword:userExist.password});
    if (!match) {
        return next(new Error("invalid password", { cause: 401 }));
    };

    const accessToken = generaToken({
       payload:{ email, id: userExist._id },
       options:{ expiresIn: "1h" }
   });
    const refreshToken = generaToken({
        payload:{ email, id: userExist._id },
        options:{ expiresIn: "7d" }
    });

    
    // send response
    return res.status(200).json({
        success: true,
        message: "login successfully",
        // token, // http req>> stateless
        access_token: accessToken,
        refresh_token : refreshToken

    });

});

const verifyGoogleToken=(idToken)=>{
    const client = new OAuth2Client();
    const ticket = client.verifyIdToken({
        idToken,
        audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();
    console.log(payload);
    return payload;
};
export const googleLogin = async(req, res, next)=>{
    // get data from req
    const{email, name, picture} = req.body;
    //check email existence
    let userExist = await User.findOne({email});
    if(!userExist){
        userExist = await User.create({
            userName: name, 
            email,
            profilePic: picture,
            provider: "google"
         });
    }
    const accessToken = generaToken({
        payload:{ email, id: userExist._id },
        options:{ expiresIn: "1h" }
    });
     const refreshToken = generaToken({
         payload:{ email, id: userExist._id },
         options:{ expiresIn: "7d" }
     });
     return res.status(200).json({
         success: true,
         message: "login successfully",
         access_token: accessToken,
         refresh_token : refreshToken
 
     });
    
};

export const activateAccount = asyncHandler(async (req, res, next) => {

    const { token } = req.params;
    const { id, error } = verify({token});
    if(error) return next(error)
    const user = await User.findByIdAndUpdate(id, { isConfirmed: true });
    if (!user)
        return next(new Error("user not found", { cause: 404 }));

   
    return res.status(200).json({
        success: true,
        message: "congratulations, plz login",
    });

});

export const refreshToken = (req, res, next)=>{
    // get data from req
    const {refreshToken} = req.body;
    const result = verifyToken({ token: refreshToken});
    if(result.error) return next (result.error);
   // generate access token
   const accessToken= generaToken({payload:{email: result.email, id: result.id},
    options:{ expiresIn: "1h" }
});
return res.status(200).json({
    success: true,
    accessToken
});

};

export const cover = (req, res, next)=>{};


export const fiftu = (req, res, next)=>{};