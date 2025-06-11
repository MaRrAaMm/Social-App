import { model, Schema } from "mongoose";
import { hash } from "../../utils/index.js";
import { Types } from "mongoose";
export const genders ={
    MALE: "male",
    M:"m",
    F:"f",
    FEMALE: "female", 
};
export const roles = {
    USER:"user",
    ADMIN:"admin",
    SUPER_ADMIN:"superAdmin",
    OWNER:"owner",
};
export const defaultProfilePic = "uploads\default.jpeg";
export const defaultSecureUrl = "https://res.cloudinary.com/dolhfem4y/image/upload/v1743769477/default_tsdii4.jpg";
export const defaultPublicId ="default_tsdii4";
// Object.values(genders);
const userSchema = new Schema(
    {
        email: {type: String, required: true,unique: [true, "email already exist"], toLowerCase: true},
        password:{ type: String,
            required: function(){
                return this.provider == "system"? true : false;
            },
        },
        userName:{
            type: String,
            required: true,
            minLength:2,
            maxLength:20,
            unique: [true, "userName already exist"]},
        phone:{ type: String,
            required: function(){
                return this.provider == "system"? true : false;
            },
             unique: [true, "phone already exist"]},
        gender: {type:String, enum: Object.values(genders)},
        // isConfirmed: { type: Boolean, default: false},
        isDeleted: {type:Boolean, default: false},
        deletedAt:{type: Date},
        role :{type: String, enum:Object.values(roles), default: roles.USER},
        otp:{type: String},
        // profilePic: {type:String, default: defaultProfilePic}, //default
        profilePic :{
            secure_url:{
                type:String, 
                default:defaultSecureUrl, 
            },
            public_id:{type:String, default:defaultPublicId},
        coverPic: [String],
        provider:{type: String, enum:["google", "system"], default:"system"},
        },
        coverPics:[{type:String}],
        updatedBy:{type:Types.ObjectId, ref:"User"},
    
    },

    {timestamps: true}
);

// middleware >> hokes
userSchema.pre("save", function (next) {
    // hash pss
    if(this.isModified("password"))
    this.password = hash({password: this.password});
    return next()
    
});
export const User = model("User",userSchema);