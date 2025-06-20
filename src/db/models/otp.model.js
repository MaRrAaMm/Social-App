import { Schema,model } from "mongoose";
const otpSchema = new Schema(
    {
    email:{type: String, required: true},
    otp: {type: String, required: true},
    destroyedAt: {type:Date, default:Date.now()}
    },
    {timestamps: true}

);
// ttl
otpSchema.index({destroyedAt:1},{expireAfterSeconds:60});
export const OTP = model("otp", otpSchema);