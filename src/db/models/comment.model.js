import { Schema, Types, model } from "mongoose";
import cloudinary from "../../utils/file uploads/cloud-config.js";
const commentSchema = new Schema(
  {
    text: {
      type: String,
       required: function(){
        return!this.attachment;
       },
    },
    post:{
      type: Types.ObjectId,
      ref: "Post",
      required: true,
    },
    user:{
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    attachment: {secure_url: String, public_id: String}, 

    likes:[
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
    parentComment:{type: Types.ObjectId, ref:"Comment"},
    updatedBy:{type:Types.ObjectId, ref:"User"},
    
  },
  { timestamps: true}
);

commentSchema.post(
  "deleteOne",
  {query:false,document:true},
  async function(doc,next){
    //check replies related comment
    const replies = await this.constructor.find({parentComment:doc._id});
    if(replies.length){
      for(const reply of replies){
        if(reply.attachment.public_id) 
          await cloudinary.uploader.destroy(reply.attachment.public_id);
        await reply.deleteOne();
      }
    }
    return next();
  }
);

export const Comment = model("Comment", commentSchema);
