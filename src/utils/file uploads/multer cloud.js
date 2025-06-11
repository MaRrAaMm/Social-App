import multer, { diskStorage } from "multer";
import { nanoid } from "nanoid";
import path from "path";
export const fileValidation= {
    images:["image/jpeg","image/png","image/webp"],
    files:["application/pdf","application/msword"],
    videos:["video/mp4"]
};

export const cloudUpload = (allowedTypes,folder)=>{
    try {
        const storage = diskStorage({});// temp
        //fileFilter layer
        const fileFilter = (req, file, cb) =>{
            // file >> {}>> field name , encoding, originalName, mimetype
            if(!allowedTypes.includes(file.mimetype)){
             return cb(new Error("invlaid file formate"), false);
            }
            return cb(null, true);
    
        };
        return multer({storage, fileFilter});
        
    } catch (error) {
        console.log(error.message);
        
        
    }
}
//diskStorage ({destination: string | function , filename: function})
// multer({ storage: result of execution diskStorage})