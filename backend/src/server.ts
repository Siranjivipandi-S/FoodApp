import Connection from "../connection/Dbconfig";
import router from "../routes/router";
import { Request, Response } from "express";
import cors from "cors";
const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use("/", router);
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to my website");
});
const PORT: number = parseInt(process.env.PORT as string, 10) || 7000;

app.listen(PORT, (): void => {
  console.log(`Server Connected to the Port of ${PORT}`);
  Connection();
});
