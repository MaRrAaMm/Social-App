import { defaultProfilePic, User } from "../../db/models/user.model.js";
import cloudinary from "../../utils/file uploads/cloud-config.js";
import { message } from "../../utils/messages/index.js";
import fs from "fs";
import path from "path";

export const getProfile = async (req, res, next) =>{
    try {
         // get data from req
         const userExist = req.authUser;
            // send response successfully
        return res.status(200).json({
            success: true,
            data:userExist,
        }); 
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const freezeAccount = async(req, res, next) =>{

    // ipdate user doc >> is delete
   await User.updateOne({_id: req.authUser._id}, {isDeleted: true, deletedAt: Date.now()});
   return res.status(200).json({
    success: true,
    message: message.user.deletedSuccessfully,
});
};

export const updateUser = async(req, res, next) =>{
    console.log("Request Object:", req);

    const{ userName, email} = req.body;
    console.log("req.userExist:", req.userExist);

    // find user
    console.log("Authenticated User:", req.authUser);
    const user = await User.findById(req.authUser._id);
    if(!user) return next(new Error(message.USER.notfound, {cause:404}));
    user.userName= userName;
    user.email= email;
    await user.save();
    return res.status(200).json({
        success: true,
        message: "user updated successfully",
    });
};

export const uploadProfilePic = async(req, res, next) =>{
    // 1-delete profilep ic from server
    const fullPath =path.resolve(req.authUser.profilePic);
    if(fs.existsSync(fullPath)&& 
    req.authUser.profilePic!= defaultProfilePic)
    fs.unlinkSync(fullPath);
    // 2-update path profile pic in db
    const user = await User.findByIdAndUpdate(req.authUser._id, {  
        profilePic: req.file.path,
    },{
        // path
        new: true
    }); 
    return res.status(200).json({success:true, data: user});
};

export const uploadProfilePicCloud =  async(req, res, next) =>{
    //delete old pic
    await cloudinary.uploader.destroy(req.authUser.profilePic.public_id);
    // upload file to cloud
    const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path,{
        folder : `social-app/users/${req.authUser._id}/profile-pic`,
        // public_id: req.authUser.profilePic.public_id,
    });
    // update to db
    const user = await User.findByIdAndUpdate(req.authUser._id,{
        profilePic:{secure_url, public_id},
    },
     {new: true}
    );
    return res.status(200).json({success: true, data:user});
};

export const uploadCoverPic = async(req, res, next)=>{
    const coverPic = req.files.map((file)=> file.path);
    await User.updateOne({_id: req.authUser._id},{coverPic});
    return res.status(200).json({success: true, message:"upload cover pic successfully"});

};

export const uploadMultiFiles = async(req, res, next)=>{
    return res.json({files: req.files});

};

export const deleteProfilePic = async(req, res, next)=>{
     const fullPath =path.resolve(req.authUser.profilePic);
     //check profile picture
     if(fs.existsSync(fullPath)&& 
     req.authUser.profilePic!= defaultProfilePic)
     fs.unlinkSync(fullPath);
     const user = await User.findByIdAndUpdate(req.authUser._id, {  
        profilePic: defaultProfilePic,
    },{
        // path
        new: true
    }); 
     return res.status(200).json({success:true, data: user});
};
