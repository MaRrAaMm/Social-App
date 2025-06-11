import { Post } from "../../db/models/post.model.js";
import { User } from "../../db/models/user.model.js";
import cloudinary from "../../utils/file uploads/cloud-config.js";

// create post 
export const createPost = async(req, res, next) =>{
    //1- upload files to cloud
    let attachment = [];
    for (const file of req.files) {
        const {secure_url, public_id} = await cloudinary.uploader.upload(
            file.path,
            {folder:`social-app/users/${req.authUser.public_id}/posts`}
        );
        attachment.push({secure_url, public_id})
        
    }
    console.log(attachment);
    
    //2-crete post >> 
    const createPost= await Post.create({
        content: req.body.content, 
        attachment,
        publisher: req.authUser._id,
    });
    //response
    return res.status(201).json({success: true, data:createPost});
};

//like Or Unlike
export const likeOrUnlike = async(req, res, next) =>{
    //get data from req
    const {id} = req.params;

    //check post existence
    const post = await Post.findById(id); //{}, null
    if(!post) return next(new Error("post not found",{cause: 404}));
    
    const userIndex = post.likes.indexOf(req.authUser._id); //-1 || 0
    if(userIndex == -1){
        post.likes.push(req.authUser._id);
    } else{
        post.likes.splice(userIndex,1)
    }
    //db update
    const updatedPost =await  post.save();
    //response
    return res.status(200).json({success: true, data:updatedPost});
};

//get posts
export const getPosts = async (req, res,next) => {
//   const posts = await Post.find();
//   populate
  const posts = await Post.find().populate([
    {path:"publisher", select:"userName profilePic.public_id"},
    {path:"likes",select:"userName profilePic.public_id"},
    {path: "comments",match:{parentComment:{$exists:false}}},

]);


  return res.status(200).json({success: true, data: posts});
};

export const getPostsData = async (req, res, next) =>{
  
  // query
  let { page, size } = req.query;
  if(!size || size  <0) size =10;
  if(!page|| page <0) page =1;

  const skip = (page - 1) * size;
  const posts = await Post.find().limit(size).skip(skip);
  const totalPosts = await Post.find().countDocuments();
  const totalPages = totalPosts /size;
  const currentPages = parseInt(page);
  if (!posts )
  return res.status(200).json({success: true,results:{data: posts, totalPages, totalPosts, currentPages}});
};

export const getSpecificPosts = async (req, res,next) => {
//   const posts = await Post.find();
//   populate
   const { id } = req.params;
   const posts = await Post.find({});
   console.log(posts);


  const post = await Post.findOne({_id:id, isDeleted:false}).populate([
    {path:"publisher", select:"userName profilePic.secure_url"},
    {path:"likes",select:"userName profilePic.secure_url"},
    {path: "comments",match:{parentComment:{$exists:false}}},

]);
  return post
  ? res.status(200).json({success: true, data: post})
  : next(new Error("post not found",{cause:404}));

};


export const hardDeletePost = async (req, res, next) => {
  const { id} = req.params;

  const post = await Post.findOneAndDelete({
    _id:id,
    publisher:req.authUser._id,
}).populate([{
    path:"comments",
    match:{parentComment:{$exists:false}},
    select:"_id attachment",
}]);
  if (!post )
    return next(new Error("post not found", { cause: 404 }));
   for (const file of post.attachment){
       await cloudinary.uploader.destroy(file.publid_id);
   }

   // delete post from DB
   for(const comment of post.comments){
    if(comment.attachment.public_id)
        await cloudinary.uploader.destroy(comment.attachment.public_id)
    await comment.deleteOne();
   }
    await post.deleteOne();

  return res.status(200).json({ success: true, message: "post deleted successfully" });
};


export const archive = async (req, res, next) => {
  const { id} = req.params;
  const post = await Post.findOneAndUpdate({
    _id:id,
    publisher:req.authUser._id,
    isDeleted:false
  },{
    isDeleted:true
  }
);
 if (!post )
    return next(new Error("post not found", { cause: 404 }));
return res.status(200).json({ success: true, message: "archived successfully" });

};

export const restore = async (req, res, next) => {
  const { id} = req.params;
  const post = await Post.findOneAndUpdate({
    _id:id,
    publisher:req.authUser._id,
    isDeleted:true
  },{
    isDeleted:false
  }
);
 if (!post )
    return next(new Error("post not found", { cause: 404 }));
return res.status(200).json({ success: true, message: "restore successfully" });

};