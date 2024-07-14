import express from "express";
import configureMiddleware from "./config/middleware.js";
import authRouter from "./controller/auth.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
configureMiddleware(app);

app.use(authRouter);

const port = process.env.APP_PORT;
app.listen(port, () => {
  console.log(`running server on port ${port}`);
});