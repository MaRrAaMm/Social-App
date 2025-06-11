import multer, { diskStorage } from "multer";
import { nanoid } from "nanoid";
import fs from "fs";
import path from "path";
export const fileValidation= {
    images:["image/jpeg","image/png","image/webp"],
    files:["application/pdf","application/msword"],
    videos:["videos/mp4"]
};

export const fileUpload = (allowedTypes,folder)=>{
    try {
        const storage = diskStorage({
            // destination: "uploads", 
            destination:(req, file, cb) =>{
                //absolute path
                //resolve , join
                const fullPath = path.resolve(`${folder}/${req.authUser._id}`);
                fs.mkdirSync(fullPath,{recursive: true});
                cb(null, `${folder}/${req.authUser._id}`);
            },
            filename: (req, file, cb)=>{
            console.log(file);
            cb(null, nanoid()+ file.originalname);
            
           },
        });
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