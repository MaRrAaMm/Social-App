import connectDB from "./db/connection.js";
import authRouter from "./modules/auth/auth.controller.js";
import userRouter from "./modules/user/user.controller.js";
import postRouter from "./modules/post/post.controller.js";
import commentRouter from "./modules/comment/comment.controller.js";
import adminRouter from "./modules/admin/admin.controllers.js";
import { globalError } from "./utils/error/global-error.js";
import { notFound } from "./utils/error/not-found.js";
import{rateLimit} from "express-rate-limit";
import cors from "cors";
const bootstrap = async (app,express) =>{
    app.use(rateLimit({
        windowMs:3*60*1000,
        limit:5
    }));
    //cors
    app.use(cors("*"));
    app.use(express.json());
    //built in middleware express 
    app.use("/uploads", express.static("uploads"));

    await connectDB();
    app.use("/auth", authRouter);

    app.use("/user",userRouter);
    app.use("/post", postRouter);
     
    app.use("/comment",commentRouter)
    app.use("/admin",adminRouter);
    app.all("*", notFound);
// golbal error middleware
app.use(globalError);
};
 
export default bootstrap;