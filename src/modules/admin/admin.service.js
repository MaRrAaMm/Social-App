import { Post } from "../../db/models/post.model.js";
import { roles, User } from "../../db/models/user.model.js";

export const getData = async (req, res, next) =>{
 
  const results = await Promise.all([User.find(),Post.find()])
   
  return res.status(200).json({ success: true, data: results});
};

export const updateRole = async(req, res, next)=>{
  const {userId, role} = req.body;
  //check hierarcky
  const targetUser = await User.findById(userId).select("role");
  const userRole = req.userExist.role;
  const targetUserRole = targetUser.role;
  const roleHierarchy = Object.values(roles);

  //find index
  const userRoleIndex = roleHierarchy.indexOf(userRole);
  const targetUserRoleIndex = roleHierarchy.indexOf(targetUserRole);
  const updatedRoleIndex = roleHierarchy.indexOf(role)
  if(userRoleIndex < targetUserRoleIndex)
    return next(new Error("not allowed",{cause:401}));
  if(userRoleIndex< updatedRoleIndex)
    return next(new Error("not allowed",{cause:401}));

  const userUpdated = await User.findByIdAndUpdate(
    userId,
    {role, updatedBy:req.userExist._id},
    {new:true}
  );
  return res.status(200).json({ success: true, data: userUpdated});
};