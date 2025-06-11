import { Comment } from "../../db/models/comment.model.js";
import { Post } from "../../db/models/post.model.js";
import cloudinary from "../../utils/file uploads/cloud-config.js";

export const createComment = async (req, res, next) => {
      const { postId,id } = req.params;
     const { text } = req.body;
   //check post existence
  const post = await Post.findById(postId);
  if (!post) return next(new Error("post not found", { cause: 404 }));
  //upload attachment cloud
  let attachment= {};
  if(req.file){
    const{secure_url, publid_id}= await cloudinary.uploader.upload(
        req.file.path,
        {folder:`social-app-1/users/${post.publisher}/posts/comments`}
    );
    attachment={secure_url, publid_id};
  }
  //create comment
  const comment = await Comment.create({
    text,
    post: postId,
    user: req.authUser._id,
    attachment,
    parentComment:id,
  });
  return res.status(201).json({ success: true, data: comment });
};


export const getComment = async (req, res, next) => {
  const { postId, id } = req.params;

  const comments = await Comment.find({
     post: postId,
     parentComment:id
    }).populate([
    {path: "user", select: "userName profilePic"},
    {path: "likes", select: "userName profilePic"},

   ]);

  return res.status(200).json({ success: true, data: comments });
};


export const deleteComment = async (req, res, next) => {
  const { id , postId} = req.params;

  const comment = await Comment.findById({_id:id}).populate([
    {path:"post", select:"publisher"}
  ]);
  if (
    comment.user.toString()!= req.authUser._id&&
    comment.post.publisher.toString()!= req.authUser._id.toString()
  ) {
    return next(new Error("not allowed", { cause: 401 }));
  }
  if (comment.attachment.publid_id)
    await cloudinary.uploader.destroy(comment.attachment.publid_id);

  await comment.deleteOne(); //hooks

  return res.status(200).json({ success: true, message: "comment deleted successfully" });
};
