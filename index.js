import express from "express";
import dotenv from "dotenv";
dotenv.config();
import bootstrap from "./src/app.controller.js";
import morgan from "morgan";
const app = express();
app.use(morgan("dev"));
bootstrap(app,express);
const port = 3000;
app.listen(port, ()=>{
    console.log("server is running in port", port);
});
