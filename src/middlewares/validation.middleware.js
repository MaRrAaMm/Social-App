import { Types } from "mongoose";
import joi from "joi";
export const generalField={
    id:joi.custom(isValidId),
    attachment:joi.object({
                fieldname: joi.string().required(),
                originalname: joi.string().required(),
                encoding: joi.string().required(),
                mimetype:joi.string().required(),
                destination: joi.string().required(),
                filename: joi.string().required(),
                path:joi.string().required(),
                size: joi.number().required(),
            })
}
export const isValid = (schema) =>{
    return (req, res, next) =>{
        if (!schema || typeof schema.validate !== "function") {
            return next(new Error("Invalid schema provided", { cause: 500 }));
        }
        
            // validation
            let data = {...req.body, ...req.query, ...req.params};
            if(req.file|| req.files) data.attachment = req.file|| req.files;
            console.log(data);
            
            const result = schema.validate(data, {abortEarly: false});
            // case fail 
            if(result.error){
                let messages = result.error.details.map((obj) =>
                 obj.message);
                return next(new Error(messages, {cause: 400}));
            }
             next();
    };
};

export function isValidId (value, helpers){
    if(!Types.ObjectId.isValid(value))return helpers.message("invalid id");
     return true;
      
};