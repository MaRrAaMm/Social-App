import joi from 'joi';
import { genders } from '../../db/models/user.model.js';

export const googleLogin = joi.object({
       idToken: joi.string().required(),
}).required();

export const sendOtp = joi.object({
       email: joi.string().email().required(),
}).required();

export let  register = joi
       .object({
        userName: joi.string().min(2).max(20).required(),
        email: joi.string().email().required(),
        password: joi.string().required(),
        cPassword: joi.string().valid(joi.ref("password")).required(),
        phone: joi.string().required(),
        gender : joi.string().valid(...Object.values(genders)),
        otp :joi.string().length(5).required(),

        })
        .required();
export let login = joi
       .object({
        email: joi.string().email().required(),
        password: joi.string().required(),
        })
        .required();

export const refreshToken = joi
  .object({
       refreshToken: joi.string().required(),
})
.required();