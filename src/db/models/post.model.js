import { Schema,Types,model } from "mongoose";
const postSchema = new Schema(
    {
    content:{type: String,
        required: function (){
            return this.attachment.length==0;
        },
    },
    attachment: [{secure_url: String, public_id: String, _id:false}], 
    publisher: {type:Types.ObjectId, ref:"User", required: true},
    likes:[{type:Types.ObjectId, ref:"User"}],
    isDeleted:{type:Boolean, default: false},
    updatedBy:{type:Types.ObjectId, ref:"User"},

    },
    {timestamps: true, toJSON:{virtuals:true}, toObject:{virtuals:true}}

);
postSchema.virtual("comments",{
    ref:"Comment",
    localField:"_id",
    foreignField:"post"
});
//model
export const Post = model("Post", postSchema);