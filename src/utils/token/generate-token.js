import jwt from "jsonwebtoken";
export const generaToken = ({payload, secretKey = process.env.SECRET_JWT,
     options = {},
    })=>{
    return jwt.sign(payload, secretKey, options)
};